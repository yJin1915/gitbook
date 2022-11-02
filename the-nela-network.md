# The Nela Network

The nodes in the Nela network are divided into three working parts:&#x20;

1. A state-of-the-art KAD-based decentralized storage solution.&#x20;
2. A Decentralized Content Acceleration Network (DSCAN).&#x20;
3. An EVM compatible blockchain.

Every node takes part in these three functionalities, this allows for effective storage sharing between the caching network and the main storage, and also allows for direct on-chain management of access control and permissions through smart contracts on the blockchain.

In Nela, all files on the decentralized storage are encrypted and managed by the Nela network. Files are stored in chunks across the storage layer and are cached across the DSCAN layer as users access the files. Through this architecture, storage of files is ensured whilst delivery and accessibility of files scales with both the growth of the network and popularity of each file.

Another novelty in Nela’s architecture is that there are no direct interactions between the storage provider and the file owner nor do storage providers choose which files to store. The network decides on the best geographical location and nodes to store files in order to provide the best performance for end users.

**Programmable licensing on assets**

Smart contracts are the interface to all access control operations. This provides many advantages; for one, every operation is journaled on-chain and transparent. In addition, smart contracts can be automated and are trust-less by nature. A user can define conditions for file access and set a price on the level of access (purchase, limited use, rental, and so forth).

The combination of security with the flexibility of smart contracts brings about the notion of programmable licensing; a file owner can program sophisticated and automatic licensing and use-right models directly into the network. This has far-reaching implications for many real-world business models. From licensing music and videos to gaming, to any business or individual who sells or rents documents, online files, or datasets.

### Decentralized Storage

Nela's decentralized storage is a state-of-the-art KAD network optimized for efficient scalability of access-control management and file sharing and distribution. Nela’s decentralized storage has the following properties:&#x20;

1. All stored files are encrypted.&#x20;
2. A simplified distributed hash table (DHT).&#x20;
3. The Nela ESeal header and encrypted body are split into two different files.&#x20;
4. Encrypted file headers are append-able and accessible on demand.

**A Simplified Distributed Hash Table (DHT).**&#x20;

In Nela’s decentralized storage, the DHT stores the hash index of the file rather than the hashes of the file’s chunks. Therefore, storage nodes in the network must store information on file chunks. When a node is searched, it returns the information on the chunks that it contains. Thus, the DHT needs to be searched only once when downloading a file from the decentralized storage, resulting in increased efficiency.&#x20;

**ESeal Header**&#x20;

In many use cases, the ESeal header file may be of significant size (for example, it may reach 100MB if one million people were to rent the file independently). Therefore, Nela’s decentralized storage supports using key-value to store each ESeal item in the ESeal header. The client only needs to download the ESeals corresponding to their own identity and not the entirety of the file.

Additionally, to avoid creating new files after every change in authority control of a file, ESeal files are stored as separate files from the file body and are append-able within Nela’s decentralized storage.

ESeal header files are associated to their body counterparts internally in the network. The hash code of the original unencrypted file body is what is used for indexing.

### Decentralized Secured Content Acceleration Network (DSCAN)

In order to achieve commercial-grade delivery performance, Nela incorporated a Decentralized Security Content Acceleration Network (DSCAN) layer directly on top of the decentralized storage.

The core functionality of DSCAN is to act as a proxy/cache layer, offering optimized file delivery across the network from any end terminal.

Proxy/cache layer implements the following key features:&#x20;

1. The proxy/cache layer is applied to every storage node in the network. Essentially, every node in the network (beside L1 bridge providers) is both a storage and proxy/cache node.&#x20;
2. When files are first uploaded to the network, they are saved whole on the proxy/cache component of the node and are uploaded and copied whole to two or more nodes. Over time, these nodes disseminate the file’s chunks across the storage layer of the network.&#x20;
3. The cache/proxy layer automatically caches files retrieved for users so that the more popular a file becomes, the more copies of it are cached on the DSCAN layer.

As a result, the network nodes provide a multilayered architecture of cache and original storage. It is key to note that users interacting with the system interact only with the proxy/cache layer of the network and the storage layer is accessed only through the proxy/cache layer.

DSCAN acts as an HTTP endpoint, thus available from any device. This also greatly decreases the learning curve for developers building on top of Nela.

When a user downloads an encrypted file from the network:&#x20;

1. If the proxy/cache node contains the file in the cache, it serves the file.&#x20;
2. Otherwise, the proxy/cache node will download the parts of the file from storage nodes, serve the blocks to the user, and cache the complete file.&#x20;
3. The proxy/cache node will maintain the copy of the full file in the cache.

DSCAN is an evolution of CDN networks. Compared to traditional CDNs, the acceleration effect is correlated to the number of nodes. In DSCAN, since every node participates in the proxy/cache layer, the greater the network size, the greater the impact. In addition to this, DSCAN employs routing optimization algorithms, different users are directed to various nearby nodes, which are resistant to DDOS attacks. Traditional decentralized systems use XOR routing addressing, and the results are inaccurate. In DSCAN, routing is based on the actual RTT detection results, which seek the fastest path to synchronize data or services.

### Consensus

As mentioned, every node in the network (besides bridge providers) supports three core functionalities - storage, proxy/cacheing, and maintaining the blockchain.

Maintaining the blockchain consensus is done through Proof of Stake. The caveat with Nela is that staking is limited to the amount of storage that is provided by the node. Since every node is a storage provider, it must stake proportionally to the amount of storage which it provides. The amount of storage provided and stored data verification is done through the Proof of Replication and Proof of Spacetime mechanisms.

An additional novelty with Nela's storage mechanism is that there is no direct relation between the user storing the file and the storage node nor incentive for a miner to store one file over the other. Instead, the file storage strategy (i.e. which storage node stores what data) is dictated by the network to optimize efficiency of delivery and security of stored files. When a network dictates that a certain node should store a particular file and that node declines to do so, it will be punished, and a portion of its staked tokens removed.

_More information on consensus can be found in Nela's Whitepaper and further details to be released soon._
