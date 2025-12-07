import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;

  onModuleInit() {
    const configSer = new ConfigService();
    const url = configSer.get<string>('SUPABASE_URL');
    const key = configSer.get<string>('SUPABASE_KEY');
    if (!url || !key) {
      throw new Error(
        'SUPABASE_URL and SUPABASE_KEY must be set in environment',
      );
    }
    this.client = createClient(url, key, {
      auth: {
        persistSession: false,
      },
    });
  }

  getClient(): SupabaseClient {
    if (!this.client) {
      this.onModuleInit();
    }
    return this.client;
  }
}
