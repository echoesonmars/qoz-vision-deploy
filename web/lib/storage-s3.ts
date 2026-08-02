import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "node:https";
import type { Readable } from "node:stream";
import { INCIDENTS_BUCKET } from "@/lib/supabase-admin";

const S3_REQUEST_TIMEOUT_MS = 600_000;
const S3_UPLOAD_RETRIES = 4;

function isS3TransientError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /bad record mac|SSL routines|ECONNRESET|ETIMEDOUT|socket hang up|EPIPE/i.test(msg);
}

async function withS3Retry<T>(fn: () => Promise<T>): Promise<T> {
  let last: unknown;
  for (let attempt = 0; attempt < S3_UPLOAD_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      if (!isS3TransientError(err) || attempt >= S3_UPLOAD_RETRIES - 1) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  throw last;
}

function s3Configured(): boolean {
  return Boolean(
    process.env.SUPABASE_S3_ACCESS_KEY_ID &&
      process.env.SUPABASE_S3_SECRET_ACCESS_KEY &&
      process.env.SUPABASE_S3_ENDPOINT,
  );
}

export function isS3StorageEnabled(): boolean {
  return s3Configured();
}

function createS3Client(): S3Client {
  const endpoint = process.env.SUPABASE_S3_ENDPOINT;
  const accessKeyId = process.env.SUPABASE_S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.SUPABASE_S3_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("S3 storage env vars are not configured");
  }
  return new S3Client({
    forcePathStyle: true,
    region: process.env.SUPABASE_S3_REGION ?? "ap-south-1",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    requestHandler: new NodeHttpHandler({
      httpsAgent: new https.Agent({ keepAlive: false, maxSockets: 1 }),
      connectionTimeout: 30_000,
      requestTimeout: S3_REQUEST_TIMEOUT_MS,
    }),
  });
}

export async function s3PutObjectStream(
  key: string,
  body: Readable,
  contentType: string,
  contentLength: number,
): Promise<void> {
  const client = createS3Client();
  await withS3Retry(() =>
    client.send(
      new PutObjectCommand({
        Bucket: INCIDENTS_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        ContentLength: contentLength,
      }),
    ),
  );
}

export async function s3UploadObject(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  const client = createS3Client();
  await withS3Retry(() =>
    client.send(
      new PutObjectCommand({
        Bucket: INCIDENTS_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        ContentLength: body.length,
      }),
    ),
  );
}

export async function s3PresignedGetUrl(
  key: string,
  expiresInSeconds: number,
): Promise<string> {
  const client = createS3Client();
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: INCIDENTS_BUCKET, Key: key }),
    { expiresIn: expiresInSeconds },
  );
}

export async function s3DeleteObject(key: string): Promise<void> {
  const client = createS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: INCIDENTS_BUCKET,
      Key: key,
    }),
  );
}

export async function s3PresignedPutUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number,
): Promise<string> {
  const client = createS3Client();
  return getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: INCIDENTS_BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: expiresInSeconds },
  );
}
