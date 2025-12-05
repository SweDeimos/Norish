import { getVideoConfig } from "@/config/server-config-loader";
import { SERVER_CONFIG } from "@/config/env-config-server";
import { db } from "@/server/db/drizzle";
import { serverConfig } from "@/server/db/schema/server-config";
import { eq } from "drizzle-orm";
import { ServerConfigKeys } from "@/server/db/zodSchemas/server-config";

async function main() {
    console.log("Checking Video Config...");
    console.log("SERVER_CONFIG.VIDEO_MAX_LENGTH_SECONDS:", SERVER_CONFIG.VIDEO_MAX_LENGTH_SECONDS);

    const config = await getVideoConfig();
    console.log("getVideoConfig():", JSON.stringify(config, null, 2));

    if (config) {
        console.log("config.maxLengthSeconds:", config.maxLengthSeconds);
        const effective = config.maxLengthSeconds ?? SERVER_CONFIG.VIDEO_MAX_LENGTH_SECONDS;
        console.log("Effective Max Length:", effective);
    } else {
        console.log("Config is null, effective max length:", SERVER_CONFIG.VIDEO_MAX_LENGTH_SECONDS);
    }

    // Check raw DB value
    const rawConfig = await db.query.serverConfig.findFirst({
        where: eq(serverConfig.key, ServerConfigKeys.VIDEO_CONFIG),
    });
    console.log("Raw DB Config:", JSON.stringify(rawConfig, null, 2));
}

main().catch(console.error).finally(() => process.exit(0));
