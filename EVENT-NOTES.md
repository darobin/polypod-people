

NOTES:
- unplug TURN connection?
- don't check capabilities
- don't check pushrules
- User.presence (matrixEvent.event):
{
    "type": "m.presence",
    "content": {
        "currently_active": true,
        "displayname": "robin",
        "presence": "online"
    },
    "sender": "@robin:matrix.polypod.bast"
}
- User.displayName (m.event)
{
    "type": "m.presence",
    "content": {
        "currently_active": true,
        "displayname": "robin",
        "presence": "online"
    },
    "sender": "@robin:matrix.polypod.bast"
}
- User.currentlyActive
{
    "type": "m.presence",
    "content": {
        "currently_active": true,
        "displayname": "robin",
        "presence": "online"
    },
    "sender": "@robin:matrix.polypod.bast"
}
- accountData: not sure, got a m.push_rules one without much
- RoomState.events (m.event, roomState, prevState, room)
{
    "content": {
        "membership": "join"
    },
    "event_id": "$eVyBdD-U9DgOcR1cysC0IQhMQi9gK-64bxlonncob2w",
    "origin_server_ts": 1725292116462,
    "sender": "@conduit:matrix.polypod.bast",
    "state_key": "@conduit:matrix.polypod.bast",
    "type": "m.room.member",
    "unsigned": {},
    "room_id": "!ZQt0j6qmm13aBNqGqv:matrix.polypod.bast"
}
roomState.events has a bunch of interesting data
room has: name, roomId
- RoomState.newMember: (m.event, rState, RoomMember, prevRState)
{
    "content": {
        "membership": "join"
    },
    "event_id": "$eVyBdD-U9DgOcR1cysC0IQhMQi9gK-64bxlonncob2w",
    "origin_server_ts": 1725292116462,
    "sender": "@conduit:matrix.polypod.bast",
    "state_key": "@conduit:matrix.polypod.bast",
    "type": "m.room.member",
    "unsigned": {},
    "room_id": "!ZQt0j6qmm13aBNqGqv:matrix.polypod.bast"
}
- RoomMember.membership
{
    "content": {
        "membership": "join"
    },
    "event_id": "$eVyBdD-U9DgOcR1cysC0IQhMQi9gK-64bxlonncob2w",
    "origin_server_ts": 1725292116462,
    "sender": "@conduit:matrix.polypod.bast",
    "state_key": "@conduit:matrix.polypod.bast",
    "type": "m.room.member",
    "unsigned": {},
    "room_id": "!ZQt0j6qmm13aBNqGqv:matrix.polypod.bast"
}
- RoomState.members
{
    "content": {
        "membership": "join"
    },
    "event_id": "$eVyBdD-U9DgOcR1cysC0IQhMQi9gK-64bxlonncob2w",
    "origin_server_ts": 1725292116462,
    "sender": "@conduit:matrix.polypod.bast",
    "state_key": "@conduit:matrix.polypod.bast",
    "type": "m.room.member",
    "unsigned": {},
    "room_id": "!ZQt0j6qmm13aBNqGqv:matrix.polypod.bast"
}
- RoomMember.name
{
    "content": {
        "displayname": "robin",
        "membership": "join"
    },
    "event_id": "$w4FUXnMsdWNreYWvKBLLFEE-bnj1KAH4-R1waHAvvUM",
    "origin_server_ts": 1725292473793,
    "sender": "@robin:matrix.polypod.bast",
    "state_key": "@robin:matrix.polypod.bast",
    "type": "m.room.member",
    "unsigned": {
        "prev_content": {
            "membership": "invite"
        },
        "prev_sender": "@conduit:matrix.polypod.bast",
        "replaces_state": "$pVBIXgEgMN-SJIuukq4dJCguz_diL4X2bp-oVxdhmtk"
    },
    "room_id": "!ZQt0j6qmm13aBNqGqv:matrix.polypod.bast"
}
- RoomState.update (room, room)
- Room.myMembership (room, room)
- Room.timeline
{
    "content": {
        "body": "### the following is a message from the conduwuit puppy\n\nit was sent on `2024-04-26`:\n\n@room: hi conduwuit users! version 0.3.0 of conduwuit was just released, and it contains a TON of fixes and improvements all around. if you're still on 0.1.6 or 0.2.0 or even lower, i strongly recommend you upgrade: https://github.com/girlbossceo/conduwuit",
        "format": "org.matrix.custom.html",
        "formatted_body": "<h3>the following is a message from the conduwuit puppy</h3>\n<p>it was sent on <code>2024-04-26</code>:</p>\n<p>@room: hi conduwuit users! version 0.3.0 of conduwuit was just released, and it contains a TON of fixes and improvements all around. if you're still on 0.1.6 or 0.2.0 or even lower, i strongly recommend you upgrade: https://github.com/girlbossceo/conduwuit</p>\n",
        "msgtype": "m.text"
    },
    "event_id": "$C8b0cBFXlrx8HdcR2byYFNBm7_sBVuvVqxJVh5xvyZE",
    "origin_server_ts": 1725292116817,
    "sender": "@conduit:matrix.polypod.bast",
    "type": "m.room.message",
    "unsigned": {
        "age": 1
    },
    "room_id": "!ZQt0j6qmm13aBNqGqv:matrix.polypod.bast"
}
