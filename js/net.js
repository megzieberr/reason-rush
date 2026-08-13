/* =====================================================================
   Reason Rush — the relay
   ---------------------------------------------------------------------
   Supabase Realtime BROADCAST only. No tables are read or written, no rows
   exist, nobody signs in. Messages pass through a channel named after the
   class code and are not stored anywhere; when the host leaves the channel
   the game is gone.
   ===================================================================== */
/* Which channel to talk on.
   The live class code is the default, but a test rig MUST NOT be able to walk
   into a live lesson — that happened on 2026-08-13: the local rig used the
   same code and three "Test" players appeared in Megan's real lobby mid-class.
   So: anything served from localhost gets its own DEV room, and an explicit
   ?room=... always wins. A learner who invents a ?room= just ends up alone in
   an empty room, which harms nobody but themselves. */
function roomCode() {
  const asked = new URLSearchParams(location.search).get('room');
  if (asked) return asked.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 12) || 'DEV';
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return 'DEV';
  return CONFIG.CLASS_CODE;
}

function makeNet(onEvent, onStatus) {
  const client = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY, {
    realtime: { params: { eventsPerSecond: 40 } }
  });
  const ch = client.channel('rr-' + roomCode(), {
    config: { broadcast: { self: false, ack: false } }
  });
  ch.on('broadcast', { event: '*' }, m => onEvent(m.event, m.payload || {}));
  ch.subscribe(s => onStatus && onStatus(s));

  return {
    send(event, payload) {
      return ch.send({ type: 'broadcast', event, payload: payload || {} });
    },
    leave() {
      try { ch.unsubscribe(); client.removeAllChannels(); } catch (e) { /* going away anyway */ }
    }
  };
}

/* sessionStorage that cannot throw — private/incognito mode on some older
   tablets raises SecurityError on any access, which would kill the Join
   button with no error shown. Falls back to in-memory (refresh loses it,
   but the app still works). */
const memStore = {};
const store = {
  get(k)    { try { return sessionStorage.getItem(k); } catch (e) { return memStore[k] !== undefined ? memStore[k] : null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} memStore[k] = v; },
  del(k)    { try { sessionStorage.removeItem(k); } catch (e) {} delete memStore[k]; }
};

/* a short id that survives a refresh or a dropped wifi connection, so a
   tablet that falls off and comes back keeps its score instead of joining
   as a new player */
function playerId() {
  let id = store.get('rr-pid');
  if (!id) {
    id = 'p' + Math.random().toString(36).slice(2, 9);
    store.set('rr-pid', id);
  }
  return id;
}
