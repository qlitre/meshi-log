import type { MicroCMSQueries } from "microcms-js-sdk";
import { getMicroCMSSchema } from "../libs/microcms";
import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import type { Env } from "hono";

const limit = 30;

export const getMcpServer = async (c: Context<Env>) => {
  const serviceDomain = c.env.SERVICE_DOMAIN;
  const apiKey = c.env.API_KEY;

  const server = new McpServer({
    name: "meshi-log MCP Server",
    version: "0.0.1",
  });

  server.tool("get_api_schema", "Get microCMS API Schema", {}, async () => {
    const result = await getMicroCMSSchema({
      serviceDomain: serviceDomain,
      apiKey: apiKey,
    });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  });
  return server;
};

const app = new Hono<Env>();

app.all("/", async (c) => {
  const mcpServer = await getMcpServer(c);
  const transport = new StreamableHTTPTransport();
  await mcpServer.connect(transport);
  return transport.handleRequest(c);
});

app.onError((err, c) => {
  console.log(err.message);

  if (err instanceof HTTPException && err.res) {
    return err.res;
  }

  return c.json(
    {
      jsonrpc: "2.0",
      error: {
        code: -32603,
        message: "Internal server error",
      },
      id: null,
    },
    500
  );
});

export default app;
