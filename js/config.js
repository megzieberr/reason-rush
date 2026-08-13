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

  /* 30, not 20: the question ends the moment everyone has answered, so a
     longer clock only ever helps the slower readers (Megan, 2026-08-13) */
  SECONDS_REASON: 30,        // pick the reason (also the yes/no questions)
  SECONDS_REL: 10,           // equal / supplementary / complementary / 360°
  SECONDS_LINES: 10,         // which two lines are parallel

  POINTS_BASE: 600,          // for getting the reason right at all
  POINTS_SPEED: 400,         // on top, scaled by how much time was left
  POINTS_FOLLOWUP_BASE: 300, // the relationship and ∥-lines parts each
  POINTS_FOLLOWUP_SPEED: 200 //   count less than the reason itself
};
