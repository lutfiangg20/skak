import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export const supabase = createClient<Database>(
	"https://lbycgoekpwpuvtwdyrvh.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxieWNnb2VrcHdwdXZ0d2R5cnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyODMwNTAsImV4cCI6MjA2OTg1OTA1MH0.QLQm-BNkT4MNE9df_X_TwIwPpJiJNNPnDLFnPQTggns",
);
