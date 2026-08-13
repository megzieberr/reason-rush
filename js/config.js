/* Reason Rush — settings you might actually want to change.
   The Supabase project (gr8-quiz-relay) is a MESSAGE RELAY ONLY. It has no
   tables, no accounts and no rows. Names and scores live in the two browsers
   and in a temporary channel; End Game closes the channel and they are gone. */
const CONFIG = {
  SUPABASE_URL: 'https://dstsjiqbbmyvobwgdmii.supabase.co',
  /* the legacy anon key on purpose: it is understood by every version of
     supabase-js, and there is nothing behind it to protect */
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdHNqaXFiYm15dm9id2dkbWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODEyNjUsImV4cCI6MjEwMjE1NzI2NX0.LNQ5zsBaLNg8LQnwVodhdu-VSlG4OgGSffkTMiwNPwQ',

  CLASS_CODE: 'MATH',        // one code for every class
  QUESTIONS: 20,

  SECONDS_REASON: 20,        // pick the reason
  SECONDS_LINES: 12,         // which two lines are parallel

  POINTS_BASE: 600,          // for getting it right at all
  POINTS_SPEED: 400,         // on top, scaled by how much time was left
  POINTS_LINES_BASE: 300,    // part 2 is worth less than part 1
  POINTS_LINES_SPEED: 200
};
