# The Registry

The registry is a distributed log store that preserves the state of the ifc hive in a legally sound and verifieable manner.

It is not a true peer to peer system that requires a full scale consensus algorithm like PAXOS or RAFT. The registry has always a fixed leader for each register, which should almost always be the registry service that runs on the same machine/cluster as the application server. This is not absolutely required, and if a client insists on hosting everythign himself, he can, for a price.

So the registry is more of a replicated database. What makes it different from normal databases or message queues is, that the datastructures are cryptographically chained transactions, which means every instance can check for consistency and tampering of any other instance independently.

With normal consensus based distributed systems, the focus is on automatically finding the canonical state, in the face of unreliable system components.
With the ifc registry, the canocical record state is always given by the master server, and all the mirrors do is make sure those records cannot be tampered with by anyone after the fact. Whenever any inconsistency is found, that is anything else but a mirror not being up to date, the goal is not to silently resolve this inconsistency in the most convenient way. The goal is to sound alarm, and have humans investigate and resolve that inconsistency. Legally if must be.
