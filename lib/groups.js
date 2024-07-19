
import * as Y from 'yjs';

const doc = new Y.Doc();
const remoteDoc = new Y.Doc();
const txt = doc.getText('name');

doc.on('update', (update, origin) => {
  console.warn(`local: ${origin.user} -> ${origin.accept ? 'ACCEPT' : 'REJECT'}`);
  console.warn(JSON.stringify(doc.getText('name').toJSON()));
  // Y.logUpdate(update);
  if (origin.user !== 'kitsune') return; // only propagate local changes
  if (!origin.accept) return; // XXX this FAILS because it stops applying after the first reject
  Y.applyUpdate(remoteDoc, update, { user: origin.user, sig: true });
});

remoteDoc.on('update', (update, origin) => {
  console.warn(`remote: ${JSON.stringify(origin)}`);
  console.warn(JSON.stringify(remoteDoc.getText('name').toJSON()));
});

[
  [() => txt.insert(0, 'robni'), true],
  [() => {
    txt.delete(3, 1);
    txt.insert(4, 'n');
  }, true],
  [() => {
    txt.delete(0, 5);
    txt.insert(0, 'Jules-Pierre');
  }, false],
  [() => txt.format(0, 5, { bold: true }), true],
].forEach(([tr, accept], idx) => {
  doc.transact(
    () => {
      console.warn(`--- tr:${idx} ---`);
      tr();
    },
    { user: 'kitsune', accept }
  );  
});

// XXX WAIT…
// Maybe it's okay if we stop applying updates from a given doc after the first update?
// If that rejection is flagging the fact that it's an invalid source, permanent rejection
// doesn't seem bad.

// XXX RETHINK
// Here is the typical use case: I invite people to a group and I want to make it look like
// they accepted even though they haven't.
// One option is to reject the update, but this puts the system in a bad state that can no
// longer process updates. Not great.
// One alternative would be to apply the update, making sure that we're the first update
// handler, mark it as invalid, refuse to process invalid origins/events/transactions in
// all handlers, and immediately apply an undo.


// XXX
// - is a group a Doc or is there a Doc of all groups?
// - can you observe a Doc?
// - is it possible to intercept and reject updates?
//    - is it that beforeTransaction we can cancel? or beforeObserverCalls we prevent
//      observer calls and roll the transaction back?
//    - it might actually be simplest to sign the binary document update before it
//      hits the wire and to validate (and possibly reject) before it even touches
//      Yjs on the receiving side. (Needs to know who is in the group, and include DID,
//      which seems reasonable)
//    - it looks like a custom provider could be the key to filter updates
//    - can we use the origin parameter to pass user + sig? (where sig signs the binary)

// MAYBE
// doc.transact(
//   () => {
//     // make some changes
//   },
//   { user, sig } // how do you get sig given that it depends on what happens in the change
// );

// doc.on('beforeTransaction', (tr, d) => {
//   // check that tr.origin has the right user and sig
// });


// OR MAYBE
// doc1.transact(()=> {
//   doc1.getArray('myarray').insert(0, ['some change']);
// }, 'user1');

// doc1.on('update', (update, origin) => {
//   if (origin !== 'user1') return; // don't propagate local changes
//   const sig = sign('user1-key', update);
//   // XXX we want to apply not just to doc2 but to send to providers
//   Y.applyUpdate(doc2, update, { user, sig });
// });
