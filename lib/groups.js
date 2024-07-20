
// NEW APPROACH
//  - We don't try to manage groups at the Y level. In fact, in some ways that
//    doesn't work so well because groups should be related directly to connections,
//    and connections should be happening at the transport layer.
//  - Instead, for groups we use Iroh documents. When we need a property signed,
//    we simply sign it in the document itself.
//  - See also https://github.com/n0-computer/iroh-examples/tree/main/tauri-todos
