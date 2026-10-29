
import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "../config/database.js";
import User from "../models/user.model.js";
import Workspace from "../models/workspace.model.js";
import Project from "../models/project.model.js";

const isApplyMode = process.argv.includes("--apply");

const migrateProjectWorkspaces = async (): Promise<void> => {
    await connectDB();

    try {
        // Step 1: Find projects that do not have a workspace.
        const projectsWithoutWorkspace = await Project.find({
            $or: [
                { workspace: { $exists: false } },
                { workspace: null },
            ],
        })
            .select("_id owner")
            .lean();

        console.log(
            `Projects missing workspace: ${projectsWithoutWorkspace.length}`
        );

        if (projectsWithoutWorkspace.length === 0) {
            console.log("No migration needed. All projects are linked.");
            return;
        }

        // Step 2: Collect unique owner IDs.
        const ownerIds = [
            ...new Set(
                projectsWithoutWorkspace.map((project) =>
                    project.owner.toString()
                )
            ),
        ];

        // Step 3: Verify that all project owners still exist.
        const users = await User.find({
            _id: { $in: ownerIds },
        })
            .select("_id name")
            .lean();

        const usersById = new Map(
            users.map((user) => [user._id.toString(), user])
        );

        const missingUsers = ownerIds.filter(
            (ownerId) => !usersById.has(ownerId)
        );

        if (missingUsers.length > 0) {
            throw new Error(
                `Migration stopped: ${missingUsers.length} project owner(s) do not exist.`
            );
        }

        // Step 4: Find existing workspaces for these owners.
        const existingWorkspaces = await Workspace.find({
            owner: { $in: ownerIds },
        })
            .select("_id owner")
            .sort({ createdAt: 1, _id: 1 })
            .lean();

        const workspaceByOwner = new Map<
            string,
            mongoose.Types.ObjectId
        >();

        for (const workspace of existingWorkspaces) {
            const ownerId = workspace.owner.toString();

            // Use the oldest existing workspace for legacy projects.
            if (!workspaceByOwner.has(ownerId)) {
                workspaceByOwner.set(ownerId, workspace._id);
            }
        }

        const ownersNeedingWorkspace = ownerIds.filter(
            (ownerId) => !workspaceByOwner.has(ownerId)
        );

        console.log(`Affected owners: ${ownerIds.length}`);
        console.log(
            `Owners with an existing workspace: ${
                ownerIds.length - ownersNeedingWorkspace.length
            }`
        );
        console.log(
            `Owners needing a new workspace: ${ownersNeedingWorkspace.length}`
        );

        // Step 5: Default mode is a read-only dry run.
        if (!isApplyMode) {
            console.log("\nDRY RUN ONLY. No database changes were made.");
            console.log(
                "Review the summary before running with --apply."
            );
            return;
        }

        // Step 6: Create a workspace only when an owner has none.
        for (const ownerId of ownersNeedingWorkspace) {
            const user = usersById.get(ownerId);

            if (!user) {
                throw new Error(`User not found: ${ownerId}`);
            }

            const workspace = await Workspace.create({
                name: `${user.name}'s Workspace`,
                owner: new mongoose.Types.ObjectId(ownerId),
            });

            workspaceByOwner.set(ownerId, workspace._id);

            console.log(`Created a workspace for owner ${ownerId}`);
        }

        // Step 7: Link only projects that are still missing a workspace.
        let migratedProjects = 0;

        for (const ownerId of ownerIds) {
            const workspaceId = workspaceByOwner.get(ownerId);

            if (!workspaceId) {
                throw new Error(
                    `No workspace available for owner ${ownerId}`
                );
            }

            const result = await Project.updateMany(
                {
                    owner: new mongoose.Types.ObjectId(ownerId),
                    $or: [
                        { workspace: { $exists: false } },
                        { workspace: null },
                    ],
                },
                {
                    $set: { workspace: workspaceId },
                }
            );

            migratedProjects += result.modifiedCount;

            console.log(
                `Owner ${ownerId}: linked ${result.modifiedCount} project(s)`
            );
        }

        // Step 8: Verify that no project is left without a workspace.
        const remainingProjects = await Project.countDocuments({
            $or: [
                { workspace: { $exists: false } },
                { workspace: null },
            ],
        });

        console.log(`\nProjects linked: ${migratedProjects}`);
        console.log(
            `Projects still missing workspace: ${remainingProjects}`
        );

        if (remainingProjects > 0) {
            throw new Error(
                "Migration incomplete. Some projects still lack a workspace."
            );
        }

        console.log("Migration completed successfully.");
    } finally {
        await mongoose.disconnect();
    }
};

migrateProjectWorkspaces().catch((error: unknown) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
});
