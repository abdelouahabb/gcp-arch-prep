export const DECISION_TREES = {
  compute: {
    id: "compute",
    title: "Compute & Container Architecture Selector",
    subtitle: "Find the exact right compute service for any PCA scenario",
    startNode: "q1",
    nodes: {
      q1: {
        question: "What type of workload are you deploying or migrating?",
        options: [
          { label: "Event-driven function or lightweight webhook (single purpose code snippet)", next: "res_functions" },
          { label: "Containerized application, microservice, or batch job", next: "q_container" },
          { label: "Virtual Machines (legacy OS, custom kernel, lift-and-shift, or BYOL license)", next: "q_vm" }
        ]
      },
      q_container: {
        question: "Does the workload need complex Kubernetes orchestration (Service Mesh, DaemonSets, StatefulSets, multi-container sidecars) or minimal NoOps serverless management?",
        options: [
          { label: "NoOps Serverless: Stateless HTTP/gRPC service or run-to-completion batch job", next: "q_cloudrun" },
          { label: "Kubernetes Ecosystem required, but we want Google to manage all nodes & bin-packing", next: "res_gke_autopilot" },
          { label: "Kubernetes required WITH custom Linux kernels, privileged DaemonSets, or direct node SSH", next: "res_gke_standard" },
          { label: "Hybrid / Multi-Cloud Kubernetes across on-premises and Google Cloud", next: "res_anthos" }
        ]
      },
      q_cloudrun: {
        question: "How is the container invoked?",
        options: [
          { label: "Listens for incoming HTTP, WebSockets, or gRPC requests (scales 0 to N)", next: "res_cloudrun_service" },
          { label: "Runs a batch script / DB migration to completion and exits (no HTTP port)", next: "res_cloudrun_jobs" }
        ]
      },
      q_vm: {
        question: "What are the licensing and availability requirements for these VMs?",
        options: [
          { label: "Bring Your Own License (BYOL) bound to physical CPU cores/sockets or strict hardware isolation", next: "res_sole_tenant" },
          { label: "Fault-tolerant batch processing / rendering where 60-91% cost savings outweigh preemption", next: "res_spot_vms" },
          { label: "Stateless scalable web/app tier needing autohealing and regional autoscaling", next: "res_mig" }
        ]
      },
      res_functions: {
        isResult: true,
        service: "Cloud Run functions (Cloud Functions 2nd Gen)",
        badge: "Serverless Event-Driven",
        why: "Built on Cloud Run and Eventarc. Ideal for lightweight, single-purpose code triggered by Pub/Sub, Cloud Storage events, Firestore changes, or HTTP webhooks without maintaining a Dockerfile.",
        avoid: "Avoid if you need multi-binary system dependencies, custom container base images, or complex Kubernetes networking."
      },
      res_cloudrun_service: {
        isResult: true,
        service: "Cloud Run Services",
        badge: "Serverless Containers (#1 Exam Pick for Stateless APIs)",
        why: "Zero infrastructure management, scales to zero to save money (or uses min-instances to avoid cold starts), handles up to 1,000 concurrent requests per instance, and supports native revision traffic splitting for Canary/Blue-Green deployments.",
        avoid: "Avoid if your workload requires persistent local disk storage or Kubernetes-specific CRDs."
      },
      res_cloudrun_jobs: {
        isResult: true,
        service: "Cloud Run Jobs",
        badge: "Serverless Batch Containers",
        why: "Executes containerized tasks that run to completion (up to 24 hours) with parallel task sharding, triggered manually or via Cloud Scheduler/Workflows, with zero cluster overhead.",
        avoid: "Do not use Cloud Run Services for batch jobs that don't listen on an HTTP port."
      },
      res_gke_autopilot: {
        isResult: true,
        service: "GKE Autopilot",
        badge: "Managed Kubernetes (Default K8s Exam Choice)",
        why: "Google provisions, hardens, and autoscales nodes automatically. You pay strictly for the vCPU/Memory requested by your Pods. Eliminates underutilized node waste and applies security best practices (Workload Identity, Shielded Nodes) out of the box.",
        avoid: "Avoid only if you need privileged host access or custom node OS kernel parameters."
      },
      res_gke_standard: {
        isResult: true,
        service: "GKE Standard",
        badge: "Full Node Control Kubernetes",
        why: "Provides full control over Node Pools, machine families, GPU time-sharing, custom Linux sysctls, and Surge vs. Blue/Green node pool upgrade strategies.",
        avoid: "Avoid if the prompt emphasizes 'minimizing Kubernetes operational overhead'—choose GKE Autopilot instead."
      },
      res_anthos: {
        isResult: true,
        service: "GKE Enterprise (Anthos)",
        badge: "Hybrid & Multi-Cloud Fleet",
        why: "Provides a unified control plane, Config Sync (GitOps), Policy Controller (OPA Gatekeeper), and Cloud Service Mesh across GKE on GCP, on-premises (VMware/Bare Metal), and AWS/Azure (EKS/AKS).",
        avoid: "Overkill if 100% of your containers run exclusively inside Google Cloud."
      },
      res_sole_tenant: {
        isResult: true,
        service: "Compute Engine Sole-Tenant Nodes",
        badge: "Physical Hardware Dedication",
        why: "Dedicates physical server hardware exclusively to your project. Required for per-core/per-socket BYOL licenses (Windows Server, SQL Server, Oracle) and strict regulatory compliance.",
        avoid: "Expensive for standard cloud-native workloads that don't have physical core licensing constraints."
      },
      res_spot_vms: {
        isResult: true,
        service: "Compute Engine Spot VMs",
        badge: "60–91% FinOps Discount",
        why: "Massive compute discounts for fault-tolerant workloads (batch jobs, CI runners, Dataproc secondary workers). Unlike legacy Preemptible VMs, Spot VMs have no 24-hour max runtime limit. Always configure a 30-second shutdown script to checkpoint state.",
        avoid: "Never use exclusively for stateful databases or SLA-critical synchronous user traffic."
      },
      res_mig: {
        isResult: true,
        service: "Regional Managed Instance Groups (MIGs)",
        badge: "High-Availability VM Clusters",
        why: "Distributes VMs across multiple zones in a region with automated health checks (autohealing), rolling/canary instance template updates, and autoscaling based on CPU, Load Balancer capacity, or Cloud Monitoring metrics.",
        avoid: "If the app is already containerized and stateless, prefer Cloud Run or GKE Autopilot."
      }
    }
  },
  database: {
    id: "database",
    title: "Database & Storage Architecture Selector",
    subtitle: "Choose between SQL, AlloyDB, Spanner, Bigtable, BigQuery, Firestore, and GCS",
    startNode: "q1",
    nodes: {
      q1: {
        question: "What structure of data are you storing?",
        options: [
          { label: "Relational (SQL tables, foreign keys, ACID joins)", next: "q_relational" },
          { label: "NoSQL (Key-Value, Wide-Column Time-Series, or JSON Documents)", next: "q_nosql" },
          { label: "Unstructured Files, Backups, Media, or Shared POSIX Filesystem", next: "q_files" }
        ]
      },
      q_relational: {
        question: "Is this an Operational Transaction (OLTP) database or an Analytical Data Warehouse (OLAP)?",
        options: [
          { label: "OLAP Data Warehouse: Petabyte analytics, BI dashboards, historical SQL aggregations", next: "res_bigquery" },
          { label: "OLTP Database: Global / Multi-Region active-active strong consistency & unlimited horizontal writes", next: "res_spanner" },
          { label: "OLTP Database: High-performance Enterprise PostgreSQL (4x faster OLTP + 100x faster analytics, 99.99% SLA)", next: "res_alloydb" },
          { label: "OLTP Database: Standard Regional MySQL, PostgreSQL, or SQL Server (< 64 TB)", next: "res_cloudsql" }
        ]
      },
      q_nosql: {
        question: "What is the primary access pattern and throughput requirement?",
        options: [
          { label: "Massive write throughput (>10k QPS), <10ms latency, IoT telemetry, time-series, or HBase API", next: "res_bigtable" },
          { label: "JSON documents, mobile/web offline sync, user profiles, serverless scale-to-zero", next: "res_firestore" },
          { label: "Sub-millisecond in-memory caching, session store, or live gaming leaderboards", next: "res_memorystore" }
        ]
      },
      q_files: {
        question: "How do workloads access the files?",
        options: [
          { label: "HTTP/REST Object API (images, videos, backups, data lake, static assets)", next: "res_gcs" },
          { label: "Shared POSIX NFS mount across multiple VMs or GKE ReadWriteMany (RWX) Pods", next: "res_filestore" },
          { label: "Low-latency Block Storage attached to Compute Engine VMs", next: "res_pd" }
        ]
      },
      res_bigquery: {
        isResult: true,
        service: "BigQuery",
        badge: "Serverless Enterprise Data Warehouse (OLAP)",
        why: "Petabyte-scale columnar SQL warehouse. Always Partition by date/timestamp and Cluster on filter columns. Supports BigQuery ML, BI Engine caching, Authorized Views, and automatic 50% Long-Term Storage discount for partitions untouched for 90 days.",
        avoid: "Never use BigQuery as a high-frequency transactional OLTP database or for <50ms single-row operational lookups."
      },
      res_spanner: {
        isResult: true,
        service: "Cloud Spanner",
        badge: "Global Relational Database (99.999% SLA)",
        why: "Combines relational SQL schema and ACID transactions with NoSQL horizontal write scalability and TrueTime external consistency across continents. Ideal for global financial ledgers and global gaming backends (Mountkirk Games).",
        avoid: "Avoid sequential/monotonic integer primary keys (causes hotspotting—use UUID v4 or bit-reversal)."
      },
      res_alloydb: {
        isResult: true,
        service: "AlloyDB for PostgreSQL",
        badge: "Enterprise High-Performance PostgreSQL",
        why: "100% PostgreSQL compatible with Google-custom storage engine, 99.99% SLA (including maintenance), built-in columnar engine for hybrid OLTP/analytics (HTAP), and top choice for migrating legacy Oracle workloads.",
        avoid: "If you need native multi-region active-active write splits across continents, use Cloud Spanner."
      },
      res_cloudsql: {
        isResult: true,
        service: "Cloud SQL (MySQL, PostgreSQL, SQL Server)",
        badge: "Regional Managed RDBMS",
        why: "Turnkey regional relational database up to 64 TB. Enable High Availability (HA) for automatic synchronous zonal failover via Regional Persistent Disk, and use Read Replicas to offload read queries.",
        avoid: "Cannot scale writes horizontally across multiple primary nodes."
      },
      res_bigtable: {
        isResult: true,
        service: "Cloud Bigtable",
        badge: "Wide-Column NoSQL for IoT & Time-Series",
        why: "Handles millions of ops/sec at <10ms latency with linear node scaling. Signature choice for Helicopter Racing League & TerramEarth streaming sensor telemetry. Design row keys carefully (e.g., device_id#reverse_timestamp) to avoid hotspotting.",
        avoid: "Does not support multi-row SQL joins or secondary indexes (indexes ONLY the single lexicographical Row Key)."
      },
      res_firestore: {
        isResult: true,
        service: "Firestore",
        badge: "Serverless Document NoSQL",
        why: "Scales from zero to millions of concurrent mobile/web clients with real-time listeners, offline persistence, and ACID multi-document transactions. Multi-region locations offer 99.999% SLA.",
        avoid: "Not designed for ultra-high-velocity raw IoT time-series sensor streams (use Bigtable)."
      },
      res_memorystore: {
        isResult: true,
        service: "Memorystore (for Redis / Redis Cluster)",
        badge: "Sub-Millisecond In-Memory Store",
        why: "Fully managed Redis/Memcached. Perfect for caching database queries, storing session tokens, or maintaining real-time gaming leaderboards via Redis Sorted Sets.",
        avoid: "Not a durable primary system of record for compliance data."
      },
      res_gcs: {
        isResult: true,
        service: "Cloud Storage (GCS)",
        badge: "Global Object Storage (11 Nines Durability)",
        why: "Use Standard for hot files, Nearline (<1/mo), Coldline (<1/qtr), Archive (<1/yr), or Autoclass. Supports Object Versioning, Bucket Lock (WORM compliance), Lifecycle Rules, and Signed URLs.",
        avoid: "Not a POSIX filesystem with byte-range in-place file locking."
      },
      res_filestore: {
        isResult: true,
        service: "Filestore",
        badge: "Managed NFS Shared File Storage",
        why: "Provides low-latency POSIX-compliant NFS mounts that can be mounted concurrently by hundreds of GCE VMs or GKE Pods using ReadWriteMany (RWX) PersistentVolumeClaims.",
        avoid: "For massive object archives or public static assets, use Cloud Storage instead."
      },
      res_pd: {
        isResult: true,
        service: "Persistent Disk / Google Cloud Hyperdisk",
        badge: "Durable Zonal & Regional Block Storage",
        why: "Block storage for GCE VMs and GKE StatefulSets. Regional Persistent Disks synchronously replicate blocks across 2 zones in a region for HA failover.",
        avoid: "If multiple VMs need to read AND write to a shared filesystem simultaneously, use Filestore (NFS) instead."
      }
    }
  },
  networking: {
    id: "networking",
    title: "Hybrid Connectivity & Multi-VPC Selector",
    subtitle: "Pick the exact VPC topology, Interconnect/VPN, or Load Balancer",
    startNode: "q1",
    nodes: {
      q1: {
        question: "What networking challenge are you solving?",
        options: [
          { label: "Connecting on-premises data centers (or another cloud) to Google Cloud", next: "q_hybrid" },
          { label: "Connecting multiple GCP Projects / VPCs together", next: "q_multivpc" },
          { label: "Selecting a Load Balancer for incoming traffic", next: "q_lb" }
        ]
      },
      q_hybrid: {
        question: "What are your bandwidth, timeline, and colocation constraints?",
        options: [
          { label: "Need immediate connectivity over the internet (< 3–6 Gbps) or an encrypted backup link", next: "res_havpn" },
          { label: "Need >= 10 Gbps (up to 200 Gbps) AND we can physically cross-connect at a Google colocation facility", next: "res_dedicated_ic" },
          { label: "Need 50 Mbps to 50 Gbps OR our data center is NOT at a Google colocation facility", next: "res_partner_ic" }
        ]
      },
      q_multivpc: {
        question: "How are the projects organized and do their IP ranges overlap?",
        options: [
          { label: "Same Organization, centralized network/security admin team managing subnets for multiple app teams", next: "res_shared_vpc" },
          { label: "Separate Organizations or overlapping IP ranges, exposing a specific service privately", next: "res_psc" },
          { label: "Decentralized teams, non-overlapping CIDRs, full bidirectional RFC1918 routing between two VPCs", next: "res_peering" }
        ]
      },
      q_lb: {
        question: "What protocol and scope does the traffic require?",
        options: [
          { label: "External HTTP / HTTPS traffic (needs Cloud CDN, Cloud Armor WAF, or IAP)", next: "res_ext_alb" },
          { label: "External non-HTTP TLS/TCP traffic needing global anycast IP and SSL termination", next: "res_ssl_tcp_proxy" },
          { label: "External or Internal UDP / TCP traffic requiring preserved client source IP and ultra-low pass-through latency", next: "res_passthrough_nlb" }
        ]
      },
      res_havpn: {
        isResult: true,
        service: "HA VPN with Cloud Router (Dynamic BGP)",
        badge: "99.99% SLA Encrypted IPSec Tunnel",
        why: "Provisions in minutes over the public internet using two active/active or active/passive IPSec tunnels and Cloud Router BGP. Can also be layered on top of Cloud Interconnect VLAN attachments when HIPAA/PCI requires encrypted Interconnect transit.",
        avoid: "Do not use Classic VPN (deprecated capabilities, static routing pitfalls, lower SLA)."
      },
      res_dedicated_ic: {
        isResult: true,
        service: "Dedicated Interconnect",
        badge: "10 Gbps / 100 Gbps Direct Fiber",
        why: "Direct physical fiber between your router and Google's network at a colocation facility. Most cost-effective per GB for massive sustained data transfers (>10 Gbps). Requires 4 links across 2 metro EADs for 99.99% SLA.",
        avoid: "Takes weeks to provision physical circuits; cannot be used if you lack presence in a Google peering colocation facility."
      },
      res_partner_ic: {
        isResult: true,
        service: "Partner Interconnect",
        badge: "50 Mbps – 50 Gbps via Carrier Partner",
        why: "Connects your data center to Google Cloud through an existing Layer 2 or Layer 3 telecom/NSP partner. Ideal when you need sub-10G bandwidth or cannot reach a Google colocation facility.",
        avoid: "Traffic is not encrypted by default—layer HA VPN over Interconnect if compliance mandates encryption."
      },
      res_shared_vpc: {
        isResult: true,
        service: "Shared VPC",
        badge: "Enterprise Multi-Project Standard",
        why: "Allows a central Network Admin team to manage a single Host Project (subnets, firewalls, Cloud Interconnect, HA VPN) while developer teams deploy VMs/GKE inside isolated Service Projects.",
        avoid: "Cannot span across two different GCP Organization nodes."
      },
      res_psc: {
        isResult: true,
        service: "Private Service Connect (PSC)",
        badge: "Zero-Trust Service-Oriented Networking",
        why: "Publishes a service via an Internal Load Balancer + Service Attachment so consumers in other VPCs or Organizations can connect via a local endpoint IP—even if both VPCs have overlapping 10.0.0.0/8 IP ranges!",
        avoid: "Designed for specific service consumption rather than full mesh subnet-to-subnet routing."
      },
      res_peering: {
        isResult: true,
        service: "VPC Network Peering",
        badge: "Direct Non-Transitive Mesh",
        why: "Low-latency kernel-level routing between two VPCs (within or across Organizations) with zero bandwidth-processing surcharge beyond standard egress.",
        avoid: "Remember: VPC Peering is NON-TRANSITIVE (A->B and B->C does NOT allow A->C) and fails if any subnet CIDRs overlap."
      },
      res_ext_alb: {
        isResult: true,
        service: "Global External Application Load Balancer",
        badge: "Layer 7 Global HTTP(S) Edge",
        why: "Provides a single global Anycast IP, URL maps/host routing, Cloud CDN caching, Cloud Armor WAF/DDoS protection, and Identity-Aware Proxy (IAP).",
        avoid: "Only supports HTTP/1.1, HTTP/2, HTTP/3 (QUIC), WebSockets, and gRPC—not arbitrary raw TCP/UDP protocols."
      },
      res_ssl_tcp_proxy: {
        isResult: true,
        service: "External Proxy Network Load Balancer (SSL / TCP Proxy)",
        badge: "Layer 4 Global Proxy",
        why: "Terminates SSL/TLS or TCP at Google's global edge for non-HTTP applications (e.g., MQTT brokers, custom financial TCP protocols) and routes over Google's backbone to the closest region.",
        avoid: "Because it is a proxy, backend VMs see the proxy's IP unless you enable the PROXY protocol header."
      },
      res_passthrough_nlb: {
        isResult: true,
        service: "Passthrough Network Load Balancer",
        badge: "Layer 4 Maglev Direct Packet Routing",
        why: "Regional non-proxied load balancer that preserves the original client source IP, supports TCP/UDP/ICMP/GRE/ESP, and offers the lowest possible latency (used for multiplayer UDP game servers or self-managed TLS termination).",
        avoid: "Regional scope only; does not terminate SSL or integrate with Cloud CDN."
      }
    }
  }
};

export const KEYWORD_DECODER = [
  { trigger: "POSIX-compliant shared file system / NFS / GKE ReadWriteMany (RWX)", service: "Filestore", category: "Storage", note: "Cloud Storage is object storage (not POSIX); Persistent Disk ReadWriteMany only supports ReadOnlyMany across multiple nodes." },
  { trigger: "Global relational database with ACID transactions & horizontal write scaling", service: "Cloud Spanner", category: "Database", note: "Provides 99.999% multi-region SLA and external consistency via TrueTime." },
  { trigger: "High-throughput (>10k QPS) IoT telemetry or time-series data with <10ms latency", service: "Cloud Bigtable", category: "Database", note: "Wide-column NoSQL. Watch out for row-key hotspotting (never start row keys with raw timestamps)." },
  { trigger: "Enterprise PostgreSQL needing 99.99% SLA and 100x faster analytical queries", service: "AlloyDB for PostgreSQL", category: "Database", note: "Includes a built-in columnar engine and is the premier target for legacy Oracle migrations." },
  { trigger: "Mobile/Web JSON document store with offline sync and real-time listeners", service: "Firestore", category: "Database", note: "Serverless NoSQL document DB that scales to zero." },
  { trigger: "Sub-millisecond real-time gaming leaderboards or session caching", service: "Memorystore for Redis", category: "Database", note: "Use Redis Sorted Sets (ZADD/ZRANGE) for real-time player leaderboards." },
  { trigger: "Late-arriving or out-of-order streaming data from mobile devices / IoT", service: "Cloud Pub/Sub + Cloud Dataflow", category: "Analytics", note: "Dataflow (Apache Beam) uses Event-Time Windowing, Watermarks, and Triggers to handle late data accurately." },
  { trigger: "Lift-and-shift existing Apache Spark or Hadoop jobs while cutting cost", service: "Cloud Dataproc + Cloud Storage (GCS)", category: "Analytics", note: "Replace HDFS with GCS, use ephemeral job-scoped clusters, and use Spot VMs for secondary workers." },
  { trigger: "Stream Pub/Sub messages directly into BigQuery with zero transformation code", service: "Pub/Sub BigQuery Subscription", category: "Analytics", note: "Eliminates the cost and operational overhead of running a pass-through Dataflow job." },
  { trigger: "Reduce BigQuery storage cost for historical partitions older than 90 days", service: "BigQuery Long-Term Storage (Automatic)", category: "Analytics", note: "Partitions untouched for 90 consecutive days automatically drop 50% in storage cost while remaining 100% queryable." },
  { trigger: "Share BigQuery query results with partners without exposing underlying tables", service: "BigQuery Authorized Views / Authorized Datasets", category: "Security", note: "Combine with Row-Level Security or Column-Level Policy Tags for granular multi-tenant access." },
  { trigger: "Prevent data exfiltration from BigQuery / Cloud Storage via stolen credentials", service: "VPC Service Controls (VPC-SC)", category: "Security", note: "Creates an API security perimeter around multi-tenant services so data cannot be copied to external buckets/projects." },
  { trigger: "Zero-trust SSH/RDP into private VMs without public IPs or Bastion hosts", service: "Identity-Aware Proxy (IAP) TCP Forwarding", category: "Security", note: "Allow ingress on port 22/3389 from 35.235.240.0/20 and enable OS Login." },
  { trigger: "GKE Pods need secure access to Cloud Storage / Spanner / BigQuery", service: "Workload Identity", category: "Security", note: "Binds Kubernetes Service Account (KSA) to GCP IAM Service Account (GSA). Never use JSON keys!" },
  { trigger: "AWS, Azure, GitHub Actions, or On-Prem workloads accessing GCP APIs without keys", service: "Workload Identity Federation", category: "Security", note: "Exchanges external OIDC/SAML/AWS tokens for short-lived GCP credentials via STS." },
  { trigger: "De-identify PII/PHI (SSNs, credit cards) while preserving SQL JOINs and format", service: "Cloud DLP Format-Preserving Encryption (FPE) / Deterministic Crypto", category: "Security", note: "Replaces sensitive strings with deterministic tokens of the same format so foreign-key joins still work." },
  { trigger: "Verify container images were built by Cloud Build and passed vulnerability scans", service: "Binary Authorization", category: "Security", note: "Enforces cryptographic attestations before GKE or Cloud Run allows a container to deploy." },
  { trigger: "Storeencryption keys in an external third-party key manager outside Google Cloud", service: "Cloud External Key Manager (Cloud EKM)", category: "Security", note: "Keeps keys in Thales/Fortanix/Virtru while allowing GCP services to request encryption/decryption over URI." },
  { trigger: "Prevent developers or Project Owners from creating VMs with public IPs or SA keys", service: "Organization Policy Service Constraints", category: "Security", note: "Use constraints/compute.vmExternalIpAccess and constraints/iam.disableServiceAccountKeyCreation." },
  { trigger: "Sync corporate Active Directory users/groups while keeping passwords on-premises", service: "Google Cloud Directory Sync (GCDS) + SAML SSO", category: "Security", note: "GCDS syncs group/user structure one-way; SAML SSO delegates authentication back to AD." },
  { trigger: "Monetize APIs, onboard external partners/dealers, enforce rate limits & OAuth", service: "Apigee API Management", category: "Implementation", note: "Featured heavily in EHR Healthcare, Helicopter Racing League, and TerramEarth." },
  { trigger: "Connect services across VPCs that have overlapping RFC1918 IP ranges", service: "Private Service Connect (PSC)", category: "Networking", note: "Uses Service Attachments and Consumer Endpoints with internal NAT, bypassing overlapping CIDR conflicts." },
  { trigger: "Centralize network, firewall, and Interconnect administration across many projects", service: "Shared VPC (Host Project + Service Projects)", category: "Networking", note: "Network Admins control the Host Project; developers deploy in Service Projects." },
  { trigger: "VMs without public IPs need to reach Cloud Storage or BigQuery APIs", service: "Private Google Access (PGA)", category: "Networking", note: "Enabled per subnet for free. Do NOT use Cloud NAT just to reach Google APIs!" },
  { trigger: "VMs without public IPs need to download OS patches from external Ubuntu/apt repos", service: "Cloud NAT", category: "Networking", note: "Allows outbound internet egress without exposing any inbound public IP." },
  { trigger: "Diagnose which specific function/line of code is causing high CPU or RAM usage in prod", service: "Cloud Profiler", category: "Operations", note: "Continuous low-overhead (<1%) statistical profiling of CPU and heap memory." },
  { trigger: "Diagnose which microservice RPC call is causing high end-to-end latency", service: "Cloud Trace", category: "Operations", note: "Distributed request tracing across microservices." },
  { trigger: "Error budget for a microservice is exhausted after a bad release", service: "Freeze new feature releases; prioritize reliability & automated tests", category: "Operations", note: "Core SRE principle tested on Section 6 of the PCA exam." },
  { trigger: "Allow external users to upload/download a specific GCS object temporarily without a Google account", service: "Cloud Storage Signed URLs", category: "Storage", note: "Cryptographically signed URL valid for a specified duration and HTTP verb (GET/PUT)." },
  { trigger: "SEC Rule 17a-4 / FINRA immutable WORM storage for regulatory audit records", service: "Cloud Storage Retention Policy with Bucket Lock", category: "Storage", note: "Once a Retention Policy is locked, nobody (not even Project Owner) can delete objects before retention expires." }
];

export const FLASHCARDS = [
  {
    id: "fc-1",
    category: "Networking",
    front: "Why can't VPC-A reach on-premises resources connected to VPC-B when VPC-A and VPC-B are connected via VPC Network Peering?",
    back: "Because **VPC Network Peering is non-transitive**. Custom/dynamic routes from VPC-B's Cloud VPN or Interconnect do not transitively hop through a peered intermediate VPC. Instead, use **Shared VPC** or **Network Connectivity Center (NCC)**."
  },
  {
    id: "fc-2",
    category: "Security",
    front: "What is the difference between CMEK, CSEK, and Cloud EKM?",
    back: "• **CMEK (Customer-Managed)**: Keys live inside Google's **Cloud KMS / Cloud HSM**, controlled & rotated by you.\n• **CSEK (Customer-Supplied)**: Raw AES-256 keys kept on-prem and sent in the HTTP header of every GCS/Persistent Disk call.\n• **Cloud EKM (External Key Manager)**: Keys stay in an external 3rd-party KMS outside GCP (e.g., Thales/Fortanix) and GCP calls out via URI."
  },
  {
    id: "fc-3",
    category: "Databases",
    front: "What causes 'Hotspotting' in Cloud Bigtable and Cloud Spanner, and how do you fix it?",
    back: "**Cause**: Starting the Row Key (Bigtable) or Primary Key (Spanner) with a **monotonically increasing timestamp or sequential integer (`AUTO_INCREMENT`)**, which routes 100% of writes to a single node/split.\n**Fix**: Prefix with a high-cardinality attribute (e.g., `device_id#reverse_timestamp`), use **UUID v4**, or **bit-reverse** the integer."
  },
  {
    id: "fc-4",
    category: "Security",
    front: "How should a GKE Pod authenticate to BigQuery or Cloud Storage following Google Cloud best practices?",
    back: "Use **Workload Identity**! It maps a Kubernetes Service Account (KSA) to a GCP IAM Service Account (GSA) via `roles/iam.workloadIdentityUser`. **Never download or mount JSON Service Account keys.**"
  },
  {
    id: "fc-5",
    category: "Analytics",
    front: "How do you handle mobile/IoT telemetry events that arrive hours late due to offline devices (Mountkirk Games / TerramEarth)?",
    back: "Ingest into **Cloud Pub/Sub** and process with **Cloud Dataflow (Apache Beam)** using **Event-Time Windowing, Watermarks, and Allowed Lateness Triggers** so events are aggregated by when they occurred on the device, not when they arrived."
  },
  {
    id: "fc-6",
    category: "SRE & Operations",
    front: "What is the difference between RPO and RTO in Disaster Recovery?",
    back: "• **RPO (Recovery Point Objective)**: Maximum acceptable **data loss** measured in time (driven by synchronous vs. asynchronous backup/replication frequency).\n• **RTO (Recovery Time Objective)**: Maximum acceptable **downtime** to restore service (driven by Cold, Warm, or Active-Active compute readiness)."
  },
  {
    id: "fc-7",
    category: "Security",
    front: "Which Cloud DLP de-identification technique should you choose if analysts still need to `JOIN` two BigQuery tables on a sensitive column like `SSN` or `Patient_ID`?",
    back: "**Crypto-Deterministic Tokenization** or **Format-Preserving Encryption (FPE)** using a surrogate InfoType. Because the same input always produces the exact same surrogate token, `JOIN` and `GROUP BY` queries continue to work without exposing real PII/PHI."
  },
  {
    id: "fc-8",
    category: "Networking",
    front: "Is traffic over Dedicated Interconnect or Partner Interconnect encrypted by default?",
    back: "**No!** Cloud Interconnect VLAN attachments are unencrypted by default. If compliance (e.g., EHR Healthcare HIPAA) mandates encryption in transit over Interconnect, configure **HA VPN over Cloud Interconnect** (IPSec) or **MACsec**."
  },
  {
    id: "fc-9",
    category: "Compute",
    front: "When should you choose GKE Autopilot vs. GKE Standard on the PCA exam?",
    back: "Default to **GKE Autopilot** whenever the prompt asks to *'minimize Kubernetes operational overhead'* or *'pay only for running Pod resources'*. Choose **GKE Standard** only if you need custom Linux kernel modules, direct node SSH, or privileged host DaemonSets."
  },
  {
    id: "fc-10",
    category: "Operations",
    front: "How do you prevent noisy debug logs from incurring Cloud Logging ingestion and storage charges?",
    back: "Create an **Exclusion Filter** in the Cloud Logging **Log Router** on the `_Default` sink. Logs matching the exclusion filter are dropped at the router before ingestion."
  }
];
