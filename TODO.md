
## Phase I — Foundation Layer

- [ ] Look at how Delta does CRDT, just the minimum, also Y.js
- [ ] Create groups as a CRDT object
  - [ ] Creation
  - [ ] Naming
  - [ ] Inviting people
  - [ ] Accepting invitations
  - [ ] Verify all messages at all endpoints (signing required — this drives Person)
- [ ] Create the simplest possible person abstraction that can
  - [ ] Hold profile: name, description, pfp
  - [ ] Map handle to DID, like PLC (it's likely PLC)
  - [ ] Have a public key to verify messages with
  - [ ] Have a private key with which to sign content (maybe the limit with PLC from Bluesky)
  - [ ] Store that private key securely (look at Delta? look at keychain)

## Phase II — Basic Apps

- [ ] Look at how Delta integrates apps into common channels
- [ ] Integrate the simplest app with a model that can share state and is safe

## Phase III — Networking

- [ ] Look at how Delta integrates with its networking layer (JSON-RPC API)
- [ ] Build a simple iroh.network that has the right properties

## Phase IV — UI

- [ ] Figure out if Tauri could be right for this

## Notes

### CRDT
So, Delta doesn't force the data sent around to be CRDT. If you just want to send updates
that follow a different mechanism (e.g. for chat) then you simply can. The example they
give is just sending chess commands.
