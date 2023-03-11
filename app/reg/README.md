# pacifico-projectjournal-registry

The registry is a distributed log store that preserves the state of the ifc hive
in a legally sound and verifiable manner.

It is not a true peer to peer system that requires a full scale consensus
algorithm like PAXOS or RAFT. The registry has always a fixed leader for each
registry, which should almost always be the registry service that runs on the
same machine or network as the application server. This is not absolutely
required, and if a client insists on hosting everything himself, he can, for a
price.

Instead the registry is more of a replicated database. What makes it different
from normal databases or message queues is, that the datastructures are
cryptographically chained transactions, which means every instance can check for
consistency and tampering of any other instance independently.

With normal consensus based distributed systems, the focus is on automatically
finding the canonical state, in the face of unreliable system components. With
the ifc registry, the canocical record state is always given by the master
server, and all the mirrors do is make sure those records cannot be tampered
with by anyone after the fact. Whenever any inconsistency is found, that is
anything else but a mirror not being up to date, the goal is not to silently
resolve this inconsistency in the most convenient way. The goal is to sound
alarm, and have humans investigate and resolve that inconsistency. Legally if
must be.

## Basic Structure

### The Cluster
A cluster of registries is all installed registries with TLS certificates
granted by the same certificate authority. They only can send and recieve
requests of servers with those certificates and reject everything else, turning
this cluster of registry server instances into a kind of "VPN".

### The Swarm
Each instance can have a number of registry swarms. What this means is, each
registry, which usually receives all the correspondence pertaining one project,
has a list of peers that are part of the project. The list of peers is just a
list of certificate IDs. The first peer in the list is the lead or main. Usually
all swarms use the same instance as the lead, because the lead is the only one
that can add new transactions in the registry, and to create new transactions,
the lead must be connected to an application server.

### Transactions
There are five different kinds of transactions for a registry:

1. Create a new registry. All this does is name and describe a registry, assign
   it an ID and configure the initial peer list, which alwayws has at least the
   lead instance.
2. Reconfigure the peer list. Writes a new peer list to reconfigure the swarm.
   This means either to add or remove peers, or just reordering them.
3. Upload documents. This uploads a document with a name and a document ID and a
   mime type. New versions of this document can be uploaded afterwards, and the
   version history is preserved.
4. Signing requests. If some version of a document needs a signature by one or
   more people, to authorize some task and make it contractually binding, each
   required signature is requested with a public key attached to the document
   and version in question.
5. Signatures. The user or party that owns the private key to a signature
   request signs and uploads the signature.

### Replication and Confirmation
Each transaction is sent to the lead of the registry swarm. The lead instance
enters the transaction into its transaction ledger with multiple hashed
backlinks. This is the canonical version. It then sends the same transaction to
all peers in the swarm. Those peers enter those transactions into their own
ledger copies and then the checksums are compared. As long as the checksums
match, it is cryptographically guaranteed, that all ledger copies are the same
and in consensus. Each peer confirms every transaction in a registry in this
manner, and each peer knows if and when any of the other peers have confirmed
the transaction.

### Conflicts
If for whatever reason a confirmation fails, which means the checksum for a
transaction is different from the lead instance in a peer, this conflict is
recorded, and all future transactions will fail until that conflict is resolved.
Conflicts can be resolved in 3 ways:

1. Replay the transaction. If the conflict was caused by a temporary technical
   issue, it should be confirmed now.
2. A reconfigure transaction to expel the offending peer. This may necessitate
   replaying some transactions, if the conflict arose after a peer was
   unreachable for a time and had to catch up.
3. Issueing alternative transactions to replace the conflicting one.

Which of these conflict resolutions is to be applied in what exact manner will
always be decided by humans, possibly legal experts. The registry exists only to
avoid those conflicts and expose them as early as possible before they become
expensive, no matter if those conflicts happen by accident or maliciously.
