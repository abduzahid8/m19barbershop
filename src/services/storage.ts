import { supabase } from '../lib/supabase';
import type { ApiResult } from './api';

const BUCKET = 'barber-portfolio';

export async function uploadImage(
  barberId: string,
  uri: string
): Promise<ApiResult<string>> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ext = uri.split('.').pop() || 'jpg';
  const filePath = `${barberId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, blob, { contentType: `image/${ext}` });
  if (uploadError) return { data: null, error: uploadError.message };

  const { data: signedUrlData, error: signedError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, 60 * 60 * 24 * 7);
  if (signedError) return { data: null, error: signedError.message };

  return { data: signedUrlData.signedUrl, error: null };
}

export async function getImageUrl(
  path: string,
  expiresIn: number = 60 * 60 * 24 * 7
): Promise<ApiResult<string>> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error) return { data: null, error: error.message };
  return { data: data.signedUrl, error: null };
}

export async function listImages(
  barberId: string
): Promise<ApiResult<string[]>> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(barberId);
  if (error) return { data: null, error: error.message };
  return {
    data: data.map((f) => `${barberId}/${f.name}`),
    error: null,
  };
}
