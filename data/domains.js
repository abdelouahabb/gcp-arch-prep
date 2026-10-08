export const EXAM_DOMAINS = [
  {
    id: "domain-1",
    number: "Section 1",
    title: "Designing and Planning a Cloud Solution Architecture",
    weight: 24,
    color: "#4285F4",
    summary: "Translating business requirements into scalable, highly available, cost-effective cloud architectures using the Google Cloud Well-Architected Framework.",
    keyTopics: [
      "Designing high-availability, fault-tolerant, and disaster-recovery architectures (RPO/RTO alignment)",
      "Evaluating compute, database, storage, and networking trade-offs (CapEx vs. OpEx, TCO, CUDs)",
      "Migration strategies: Rehost (Lift & Shift), Replatform (Lift & Optimize), Refactor/Re-architect, Strangler Fig pattern",
      "Designing hybrid and multi-cloud topologies (Anthos/GKE Enterprise, Cross-Cloud Interconnect, Workload Identity Federation)"
    ]
  },
  {
    id: "domain-2",
    number: "Section 2",
    title: "Managing and Provisioning a Solution Infrastructure",
    weight: 15,
    color: "#34A853",
    summary: "Configuring and provisioning VPC networks, hybrid connectivity, compute clusters, storage systems, and Infrastructure as Code (Terraform).",
    keyTopics: [
      "VPC topology design: Shared VPC vs. VPC Peering vs. Private Service Connect (PSC)",
      "Hybrid networking: Dedicated vs. Partner Interconnect, HA VPN with dynamic BGP routing (Cloud Router)",
      "Provisioning GKE (Autopilot vs. Standard), MIGs, Cloud Run, and database instances",
      "Infrastructure as Code (Terraform, Config Connector, Cloud Foundation Toolkit)"
    ]
  },
  {
    id: "domain-3",
    number: "Section 3",
    title: "Designing for Security and Compliance",
    weight: 18,
    color: "#EA4335",
    summary: "Zero-trust security architecture, resource hierarchy, IAM least privilege, data encryption (CMEK/CSEK/EKM), VPC Service Controls, and regulatory compliance (HIPAA, PCI-DSS, GDPR).",
    keyTopics: [
      "Resource Hierarchy (Organization, Folders, Projects) and Organization Policy Constraints",
      "Identity & Access Management: Workload Identity Federation, Service Account Impersonation, IAM Conditions, IAP",
      "Data Security: Cloud KMS (CMEK, CSEK, EKM), Secret Manager, Cloud DLP (Sensitive Data Protection)",
      "Network & Perimeter Security: VPC Service Controls, Cloud Armor (WAF/DDoS), Private Google Access, Hierarchical Firewall Policies"
    ]
  },
  {
    id: "domain-4",
    number: "Section 4",
    title: "Analyzing and Optimizing Technical and Business Processes",
    weight: 18,
    color: "#FBBC04",
    summary: "Analyzing legacy bottlenecks, CI/CD modernization, FinOps cost optimization, capacity planning, and stakeholder risk management.",
    keyTopics: [
      "FinOps & Cost Optimization: Committed Use Discounts (Resource vs. Spend-based), Spot VMs, BigQuery Editions/Slots, Autoclass",
      "CI/CD & Software Delivery: Cloud Build, Cloud Deploy, Artifact Registry, Binary Authorization",
      "Performance & Scalability Tuning: Cloud CDN, Memorystore caching, Bigtable row-key design, Spanner schema optimization",
      "Chaos engineering, game days, and capacity stress testing"
    ]
  },
  {
    id: "domain-5",
    number: "Section 5",
    title: "Managing Implementation",
    weight: 11,
    color: "#A142F4",
    summary: "Advising development and operations teams on API management (Apigee), SDK/CLI tooling, deployment strategies, and safe rollout patterns.",
    keyTopics: [
      "Deployment patterns: Blue/Green, Canary, Rolling Updates, Traffic Splitting (Cloud Run, GKE Gateway API, MIGs)",
      "API Management with Apigee (rate limiting, quotas, OAuth2/JWT verification, monetization, analytics)",
      "Programmatic interaction: gcloud CLI, gsutil/gcloud storage, bq CLI, client libraries, Cloud Shell",
      "Testing environments and ephemeral preview environments in CI/CD pipelines"
    ]
  },
  {
    id: "domain-6",
    number: "Section 6",
    title: "Ensuring Solution and Operations Reliability",
    weight: 14,
    color: "#24C1E0",
    summary: "Site Reliability Engineering (SRE) practices, observability (Cloud Monitoring, Logging, Trace, Profiler), incident response, and blameless postmortems.",
    keyTopics: [
      "SRE Fundamentals: SLIs, SLOs, SLAs, Error Budgets, Toil reduction",
      "Observability Suite: Cloud Logging (Log Router, Inclusion/Exclusion Sinks, Aggregated Sinks), Cloud Monitoring, Cloud Trace, Cloud Profiler",
      "High Availability & Failover testing, backup verification, and disaster recovery drills",
      "Incident Management & Blameless Postmortems"
    ]
  }
];

export const KNOWLEDGE_MODULES = [
  {
    id: "compute-serverless",
    category: "Compute & Containers",
    title: "Compute Engine, GKE & Serverless Architecture",
    icon: "cpu",
    domainIds: ["domain-1", "domain-2", "domain-4"],
    tagline: "Mastering GCE MIGs, GKE Standard vs. Autopilot, Cloud Run, and Workload Identity.",
    overview: `In the PCA exam, choosing a compute platform is rarely just about "what runs containers." You must evaluate operational overhead (NoOps vs. fine-grained kernel/node control), scaling velocity, cold-start sensitivity, networking integration, GPU/TPU hardware needs, and licensing constraints (e.g., BYOL Windows/SQL Server requiring Sole-Tenant Nodes).`,
    sections: [
      {
        heading: "1. Compute Engine (GCE) & Managed Instance Groups (MIGs)",
        content: [
          "**Machine Families**: **E2** (cost-optimized general purpose, shared/sustained core), **N2/N2D/N4** (balanced general purpose, supports custom machine types and sustained/committed use discounts), **C2/C3/C4** (compute-optimized for high single-thread performance like gaming servers or HPC), **M1/M2/M3** (memory-optimized for SAP HANA or large in-memory databases), **A2/A3/G2** (accelerator-optimized with NVIDIA A100/H100/L4 GPUs).",
          "**Managed Instance Groups (MIGs)**: Provide autohealing (always use an application-level `/healthz` HTTP check, not just TCP ping, to verify downstream dependencies without cascading failures), autoscaling (CPU, Load Balancer utilization, Cloud Monitoring custom metrics, or Pub/Sub queue depth), and regional multi-zone distribution.",
          "**Stateful MIGs**: Used when instances need persistent identity, preserved boot/attached persistent disks, or static internal IPs across restarts/recreations (e.g., legacy clustered databases or ZooKeeper ensembles).",
          "**Spot VMs (formerly Preemptible VMs)**: Up to 60–91% discount, no SLA, can be reclaimed with a 30-second preemption notice (handled via shutdown scripts). Unlike legacy Preemptible VMs, **Spot VMs have no 24-hour maximum runtime limit**. Ideal for fault-tolerant batch processing, rendering, and Dataproc secondary workers.",
          "**Sole-Tenant Nodes**: Physically dedicated GCE servers for **BYOL (Bring Your Own License)** per-core/per-socket licenses (Windows Server, SQL Server, Oracle) or strict regulatory hardware isolation."
        ]
      },
      {
        heading: "2. Google Kubernetes Engine (GKE): Autopilot vs. Standard",
        content: [
          "**GKE Autopilot (Default Exam Recommendation for K8s)**: Google manages the worker nodes, node pools, security hardening, and scaling completely. You pay **only for the CPU, memory, and ephemeral storage requested by your running Pods**. If the exam prompt says *'minimize Kubernetes operational overhead'* or *'optimize bin-packing and management cost'*, choose **GKE Autopilot**.",
          "**GKE Standard**: Choose only when you require direct SSH access to nodes, custom Linux kernel tuning (`sysctl`), privileged DaemonSets that modify the host OS, specific non-standard machine types, or granular control over node pool upgrades (Surge vs. Blue-Green node upgrades).",
          "**Workload Identity (CRITICAL FOR EXAM)**: The Google-recommended way for GKE Pods to authenticate to GCP APIs (BigQuery, Cloud Storage, Spanner, Secret Manager). It binds a **Kubernetes Service Account (KSA)** to an **IAM Service Account (GSA)** via `roles/iam.workloadIdentityUser`. **Never export JSON Service Account keys into Kubernetes Secrets!**",
          "**GKE Dataplane V2**: Powered by eBPF and Cilium. Provides built-in Kubernetes Network Policy enforcement, high-performance pod-to-pod routing, and real-time network policy logging without needing Calico.",
          "**Binary Authorization**: Enforces deploy-time security control in GKE and Cloud Run by requiring container images to have cryptographic **attestations** (signed by Cloud KMS keys via Artifact Analysis / Kritis) proving they passed CI vulnerability scans and QA stages before deployment."
        ]
      },
      {
        heading: "3. Cloud Run, Cloud Run Jobs & Cloud Functions (2nd Gen)",
        content: [
          "**Cloud Run Services**: Fully managed serverless container platform for stateless HTTP/gRPC microservices, web apps, and REST APIs. Scales to zero (cost-effective for spiky/idle workloads) or maintains `min-instances` to eliminate cold starts. Supports concurrency up to 1,000 requests per container instance.",
          "**CPU Allocation**: By default, CPU is allocated **only during request processing**. If your app performs background work briefly after returning an HTTP response or maintains persistent WebSockets/streams, enable **CPU Always Allocated**.",
          "**Cloud Run Jobs**: Designed for containers that run to completion and exit (batch scripts, database schema migrations, nightly reports) rather than listening on an HTTP port. Supports parallel task arrays and up to 24 hours of execution.",
          "**Direct VPC Egress vs. Serverless VPC Access Connector**: Cloud Run can connect to private VPC IPs (Cloud SQL, Memorystore) using **Direct VPC Egress** (lower latency, higher throughput, no extra VM connector proxy cost) or a **Serverless VPC Access Connector** (required only for specific legacy routing/NAT scenarios)."
        ]
      }
    ],
    comparisonTable: {
      headers: ["Service", "Best Use Case", "Scale to Zero?", "Max Timeout / Runtime", "Exam Trigger Keywords"],
      rows: [
        ["Cloud Run Services", "Stateless HTTP/gRPC APIs, web apps, microservices", "Yes (configurable min-instances)", "60 minutes per HTTP request", "'Containerized stateless web API', 'scale to zero', 'minimal ops', 'traffic splitting'"],
        ["Cloud Run Jobs", "Containerized batch tasks, DB migrations, cron jobs", "Yes (runs on trigger/schedule)", "24 hours", "'Run container to completion', 'nightly batch script without managing clusters'"],
        ["GKE Autopilot", "Complex microservices mesh, multi-container pods, stateful K8s", "Pods scale down; pay per Pod request", "Unlimited", "'Kubernetes ecosystem', 'Helm/Istio/Service Mesh', 'minimal node management overhead'"],
        ["Compute Engine MIG", "Legacy VMs, custom OS kernels, non-containerized apps", "Yes (can scale to 0 instances)", "Unlimited", "'Custom kernel module', 'lift and shift VMs', 'autohealing and autoscaling VMs'"],
        ["App Engine (Standard/Flex)", "Legacy PaaS web apps (mostly maintenance scenarios)", "Standard: Yes / Flex: No (min 1)", "10–60 mins", "'Existing App Engine app', 'version traffic splitting without Docker (Standard)'"]
      ]
    },
    examTraps: [
      {
        trap: "Exporting a Service Account JSON key and mounting it as a Kubernetes Secret in GKE or passing it as an environment variable in Cloud Run.",
        reality: "NEVER create or download JSON keys if the workload runs in GCP or supports OIDC/SAML! On GKE, always use **Workload Identity**. On Cloud Run/GCE, attach a **dedicated user-managed Service Account** directly to the revision/VM. For external clouds (AWS/Azure/GitHub Actions/on-prem), use **Workload Identity Federation**."
      },
      {
        trap: "Using a Liveness / Health Check endpoint that queries the production database on every 5-second poll.",
        reality: "If the database has a brief latency spike, all MIG VMs or GKE Pods will fail their health checks simultaneously and get killed/restarted, causing a **cascading failure / thundering herd**. Health checks for autohealing should verify local process health, while readiness probes gate traffic."
      }
    ],
    cliExamples: `# Bind GKE Kubernetes Service Account (KSA) to GCP IAM Service Account (GSA)
gcloud iam service-accounts add-iam-policy-binding app-gsa@PROJECT_ID.iam.gserviceaccount.com \\
    --role="roles/iam.workloadIdentityUser" \\
    --member="serviceAccount:PROJECT_ID.svc.id.goog[NAMESPACE/KSA_NAME]"

# Deploy a Cloud Run canary revision with 10% traffic split
gcloud run deploy order-service --image=us-docker.pkg.dev/proj/repo/order:v2 --no-traffic --tag=canary
gcloud run services update-traffic order-service --to-tags canary=10`
  },
  {
    id: "networking-hybrid",
    category: "Networking & Hybrid",
    title: "VPC Design, Hybrid Connectivity & Global Load Balancing",
    icon: "network",
    domainIds: ["domain-1", "domain-2", "domain-3"],
    tagline: "Shared VPC vs. Peering vs. PSC, HA VPN vs. Interconnect, and the Load Balancer matrix.",
    overview: `Networking is the backbone of almost every PCA scenario. Google's Andromeda SDN makes VPCs **global resources**, while **Subnets are regional resources** (spanning all zones within that region). Understanding how on-premises networks connect to GCP, how projects share network boundaries without overlapping IP collisions, and which Load Balancer fits which protocol/scope is essential to passing.`,
    sections: [
      {
        heading: "1. Multi-Project VPC Topologies: Shared VPC vs. VPC Peering vs. PSC",
        content: [
          "**Shared VPC (Centralized Network Governance)**: A single **Host Project** owns the VPC network, subnets, routes, VPN/Interconnects, and firewalls. Multiple **Service Projects** attach to the Host Project so their VMs/GKE clusters can use the shared subnets. Network Admins manage the Host Project (`roles/compute.networkAdmin`), while Developers deploy workloads in Service Projects with subnet-level permissions (`roles/compute.networkUser`). **Best for within a single Organization.**",
          "**VPC Network Peering (Decentralized)**: Connects two VPCs (even across different Organizations). Supports up to 25 direct peers. **CRITICAL LIMITATION: VPC Peering is NON-TRANSITIVE!** If VPC-A peers with VPC-B, and VPC-B peers with VPC-C, VPC-A **cannot** talk to VPC-C without a direct A-to-C peering or a Network Connectivity Center (NCC) / NVA hub. Also requires non-overlapping CIDR blocks.",
          "**Private Service Connect (PSC) (Modern Service-Oriented Networking)**: Allows a producer in one VPC to publish a managed service (via an Internal Load Balancer + Service Attachment) and a consumer in another VPC (or on-prem) to access it via a local PSC Endpoint IP or PSC Backend. **Solves overlapping IP addresses**, enforces unidirectional connection initiation, and eliminates transitive peering limits!"
        ]
      },
      {
        heading: "2. Hybrid Connectivity: HA VPN vs. Dedicated & Partner Interconnect",
        content: [
          "**HA VPN (High Availability Cloud VPN)**: IPSec VPN over the public internet. Provides a **99.99% SLA** when configured with **two interfaces** on the Cloud VPN gateway connected to two tunnels (Active/Active or Active/Passive) using **Cloud Router (dynamic BGP)**. Each tunnel achieves up to **3 Gbps** (or higher with multiple tunnels/ECMP). Best for quick deployment, low-to-moderate bandwidth, or as a backup for Cloud Interconnect.",
          "**Dedicated Interconnect**: Direct physical fiber connection between your on-premises router and Google's peering edge at a colocation facility. Sold in **10 Gbps** or **100 Gbps** links (up to 8x10G or 2x100G). Takes weeks to provision physical cross-connects. **99.99% SLA requires 4 redundant links across 2 metropolitan edge availability domains (EADs).**",
          "**Partner Interconnect**: Connectivity through a supported NSP (Network Service Provider) when your data center is not in a Google colocation facility OR when you need fractional bandwidth (**50 Mbps to 50 Gbps**). Also supports 99.99% SLA with redundant VLAN attachments across two EADs.",
          "**Encryption over Interconnect**: Cloud Interconnect traffic is **not encrypted by default** at the link layer! If a compliance requirement (e.g., HIPAA/PCI-DSS or strict corporate policy) mandates encrypted hybrid transit over Interconnect, deploy **HA VPN over Cloud Interconnect** (IPSec over VLAN attachments) or **MACsec for Cloud Interconnect**."
        ]
      },
      {
        heading: "3. Private Access to Google APIs & Outbound NAT",
        content: [
          "**Private Google Access (PGA)**: Enabled at the **Subnet level**. Allows VMs **without external IP addresses** to reach Google APIs and services (Cloud Storage, BigQuery, Artifact Registry) over Google's internal network via `private.googleapis.com` (`199.36.153.8/30`, which reaches only APIs supported by VPC Service Controls) or `restricted.googleapis.com` (`199.36.153.4/30`, which forces all traffic through VPC-SC checks).",
          "**Private Google Access for On-Premises Hosts**: On-prem servers can reach Google APIs privately through Cloud VPN or Cloud Interconnect by routing `199.36.153.8/30` (or `restricted.googleapis.com`) over BGP and configuring on-prem DNS to resolve `*.googleapis.com` as a CNAME to `private.googleapis.com`.",
          "**Cloud NAT**: Software-defined, managed Network Address Translation service without middlebox VMs. Allows private VMs/GKE nodes to initiate **outbound** connections to the internet (e.g., downloading OS patches or calling third-party APIs) while blocking unsolicited **inbound** connections from the internet."
        ]
      },
      {
        heading: "4. Google Cloud Load Balancing Matrix & Edge Security",
        content: [
          "**Global External Application Load Balancer (HTTP/HTTPS)**: Layer 7 Envoy-based reverse proxy deployed at Google's 100+ global Points of Presence (PoPs). Terminates TLS close to the user, routes traffic over Google's premium backbone to the closest healthy regional backend (MIGs, GKE NEGs, Cloud Run Serverless NEGs, Cloud Storage buckets), and integrates natively with **Cloud CDN**, **Cloud Armor** (WAF, DDoS protection, rate limiting, geo-blocking, adaptive protection), and **Identity-Aware Proxy (IAP)**.",
          "**External Proxy Network Load Balancer (SSL Proxy / TCP Proxy)**: Layer 4 global/regional proxy for non-HTTP traffic. **SSL Proxy** terminates TLS for non-HTTP protocols (e.g., secure MQTT/IoT or custom TLS protocols); **TCP Proxy** handles non-TLS TCP traffic globally.",
          "**Passthrough Network Load Balancer (External / Internal)**: Layer 4 regional load balancer powered by Maglev/Andromeda. **Does NOT proxy or terminate connections**—packets are delivered directly to backend VMs with the **original client source IP preserved** and super-low latency. Supports TCP, UDP, ESP, GRE, ICMP."
        ]
      }
    ],
    comparisonTable: {
      headers: ["Connectivity Option", "Bandwidth Capacity", "SLA (Max Config)", "Encryption", "When to Choose on Exam"],
      rows: [
        ["HA VPN", "Up to 3 Gbps per tunnel (scales via ECMP)", "99.99% (2 tunnels)", "Built-in IPSec (IKEv2)", "Immediate setup needed, < 3-6 Gbps, or encrypted backup for Interconnect"],
        ["Partner Interconnect", "50 Mbps to 50 Gbps", "99.99% (4 VLANs, 2 EADs)", "Unencrypted (use HA VPN over Interconnect for IPSec)", "Need < 10 Gbps dedicated link OR data center cannot reach Google colocation"],
        ["Dedicated Interconnect", "10 Gbps or 100 Gbps per link (up to 200+ Gbps)", "99.99% (4 links, 2 metro EADs)", "Unencrypted (supports MACsec or HA VPN on top)", "Massive hybrid data transfer (> 10 Gbps) and presence in Google colocation facility"],
        ["Cross-Cloud Interconnect", "10 Gbps or 100 Gbps", "99.99%", "Supports MACsec", "High-bandwidth private link directly between GCP and AWS, Azure, OCI, or Alibaba"]
      ]
    },
    examTraps: [
      {
        trap: "Assuming VPC Network Peering allows VPC-A to reach on-premises through VPC-B's Cloud VPN/Interconnect.",
        reality: "No! Transitive routing across VPC Peering is blocked. To share a single set of hybrid VLAN attachments/VPNs across multiple teams/projects, use **Shared VPC** or configure **Network Connectivity Center (NCC)** as a hybrid transit hub."
      },
      {
        trap: "Enabling Cloud NAT so that VMs without external IPs can read/write to Cloud Storage or BigQuery.",
        reality: "You do NOT need Cloud NAT to reach Google APIs! Simply enable **Private Google Access (PGA)** on the subnet—it is free and keeps traffic strictly inside Google's network."
      }
    ],
    cliExamples: `# Enable Private Google Access on a regional subnet
gcloud compute networks subnets update prod-us-central1 \\
    --region=us-central1 \\
    --enable-private-ip-google-access

# Create a Cloud Armor security policy rule to rate-limit by IP
gcloud compute security-policies rules create 1000 \\
    --security-policy=edge-waf-policy \\
    --action=rate-based-ban \\
    --rate-limit-threshold-count=500 \\
    --rate-limit-threshold-interval-sec=60 \\
    --ban-duration-sec=600`
  },
  {
    id: "storage-databases",
    category: "Storage & Databases",
    title: "Storage, Relational (SQL/AlloyDB/Spanner) & NoSQL (Bigtable/Firestore)",
    icon: "database",
    domainIds: ["domain-1", "domain-2", "domain-4"],
    tagline: "Choosing the exact right database, avoiding Bigtable/Spanner hotspotting, and lifecycle management.",
    overview: `Database and storage selection is one of the highest-weighted topics on the PCA exam. You must distinguish between Relational OLTP (Cloud SQL, AlloyDB, Cloud Spanner), NoSQL Document (Firestore), NoSQL Wide-Column High-Throughput (Bigtable), In-Memory Caching (Memorystore), Object Storage (Cloud Storage), Block Storage (Persistent Disk / Hyperdisk), and Network File Storage (Filestore).`,
    sections: [
      {
        heading: "1. Relational OLTP: Cloud SQL vs. AlloyDB vs. Cloud Spanner",
        content: [
          "**Cloud SQL (MySQL, PostgreSQL, SQL Server)**: Regional managed RDBMS (up to 64 TB storage). **High Availability (HA)** uses a primary instance in Zone A and a standby instance in Zone B sharing synchronous replication via **Regional Persistent Disk** (automatic failover in ~60–120 seconds). **Read Replicas** are asynchronous and used to offload read-heavy reporting queries or cross-region DR (must be manually promoted in a regional outage). Always use **Cloud SQL Auth Proxy** for secure IAM-authenticated, TLS-encrypted connections.",
          "**AlloyDB for PostgreSQL**: Google-engineered PostgreSQL-compatible database built for enterprise workloads. Delivers **4x faster transactional throughput** and **up to 100x faster analytical queries** (via a built-in columnar engine) than standard PostgreSQL, with a **99.99% SLA** (inclusive of maintenance). Ideal for migrating high-end Oracle or enterprise Postgres workloads within a region (plus cross-region read pools).",
          "**Cloud Spanner**: Globally distributed, horizontally scalable relational database with **strong external consistency** (powered by hardware atomic clocks and GPS via **TrueTime**), full ANSI SQL, ACID transactions, and up to **99.999% SLA** (multi-region configuration). Choose Spanner when the scenario requires **global horizontal write scaling**, **multi-region active-active strong consistency**, or **zero-downtime scaling beyond a single regional primary**.",
          "**Spanner Schema Anti-Pattern (Hotspotting)**: Never use a monotonically increasing integer (`AUTO_INCREMENT` or sequential timestamp) as the leading column of a Primary Key in Cloud Spanner! Because Spanner splits tables by key range across servers, sequential keys force all new inserts onto a single split server. **Fix**: Use a **UUID v4**, bit-reverse the sequential integer, or prefix the key with a shard/hash column."
        ]
      },
      {
        heading: "2. NoSQL Databases: Cloud Bigtable vs. Firestore vs. Memorystore",
        content: [
          "**Cloud Bigtable**: Petabyte-scale, wide-column NoSQL database (HBase API compatible) designed for **massive ingestion throughput (>10,000 QPS)** and **sub-10ms single-digit millisecond latency**. The #1 exam choice for **IoT sensor telemetry, time-series data, financial market tick data, and AdTech clickstreams**.",
          "**Bigtable Row Key Design (CRITICAL FOR EXAM)**: Bigtable indexes ONLY a single **Row Key** (lexicographically sorted). Good row keys enable range scans for common queries while distributing writes evenly across tablet servers (e.g., `device_type#device_id#reverse_timestamp`). **Bad row keys** that cause **Hotspotting** (checked via **Key Visualizer**): starting the row key with a raw timestamp (`20261008...`), sequential numeric IDs, or low-cardinality values (`sensor_status#...`).",
          "**Firestore (Native vs. Datastore Mode)**: Serverless NoSQL document database. Supports ACID transactions, automatic scaling to zero, offline mobile/web SDK synchronization, and real-time listeners. Choose Firestore for **user profiles, product catalogs, mobile/web app state, and gaming session inventories**.",
          "**Memorystore (for Redis / Redis Cluster / Memcached)**: Managed in-memory key-value data store. Placed in front of Cloud SQL/Spanner/Firestore to cache frequent read queries, store ephemeral user sessions, or power real-time gaming leaderboards (using Redis Sorted Sets `ZADD`/`ZRANGE`)."
        ]
      },
      {
        heading: "3. Object, Block, and File Storage",
        content: [
          "**Cloud Storage (GCS)**: Global object storage with 11 nines (99.999999999%) annual durability. Four storage classes: **Standard** (hot data, no minimum duration, no retrieval fee), **Nearline** (accessed < 1x/month, 30-day min duration), **Coldline** (accessed < 1x/quarter, 90-day min duration), **Archive** (accessed < 1x/year, 365-day min duration, instant millisecond access—no hours-long glacier thawing!). **Autoclass** automatically transitions objects between classes based on last access time.",
          "**GCS Security & Compliance Features**: **Uniform Bucket-Level Access** (disables legacy per-object ACLs in favor of IAM entirely—recommended best practice), **Object Versioning** (protects against accidental deletion/overwrites), **Retention Policies with Bucket Lock** (WORM—Write Once Read Many compliance for SEC Rule 17a-4 / FINRA), and **Signed URLs** (grants temporary time-bound upload/download permissions directly to external clients without proxying files through your backend servers).",
          "**Filestore**: Managed NFS (Network File System) storage. Whenever an exam question mentions **'POSIX-compliant shared file system'**, **'ReadWriteMany (RWX) PersistentVolumes shared across multiple GKE Pods or GCE VMs'**, or **'legacy enterprise CMS expecting a shared NFS mount'**, the answer is **Filestore** (or Cloud Storage FUSE if eventual consistency and object semantics are acceptable for AI/ML training datasets)."
        ]
      }
    ],
    comparisonTable: {
      headers: ["Database / Storage", "Data Model", "Max SLA", "Horizontal Write Scaling?", "Signature Exam Use Case"],
      rows: [
        ["Cloud SQL", "Relational (MySQL/PG/MSSQL)", "99.95%", "No (Vertical primary + Read Replicas)", "Regional lift-and-shift relational DB (<64 TB) with standard HA"],
        ["AlloyDB", "Relational (PostgreSQL)", "99.99%", "Regional primary + scalable Read Pools + Columnar Engine", "High-performance enterprise PostgreSQL, Oracle migrations, hybrid OLTP/HTAP"],
        ["Cloud Spanner", "Relational (Global ACID SQL)", "99.999%", "Yes (Global multi-region linear scaling)", "Global financial ledgers, global gaming inventory, multi-region active-active RDBMS"],
        ["Firestore", "NoSQL Document", "99.999%", "Yes (Serverless auto-sharding)", "Mobile/web backends, real-time offline sync, user profiles, shopping carts"],
        ["Cloud Bigtable", "NoSQL Wide-Column", "99.999%", "Yes (Linearly scales by adding nodes)", "IoT telemetry streams, time-series metrics, financial ticks (>10k writes/sec, <10ms)"],
        ["Filestore", "Managed File Share (NFS)", "99.99% (Enterprise)", "Scales capacity/IOPS per share", "Shared POSIX filesystem across multiple GCE VMs or GKE ReadWriteMany pods"]
      ]
    },
    examTraps: [
      {
        trap: "Using Cloud SQL Read Replicas for High Availability (HA) automatic failover.",
        reality: "Cloud SQL **HA** uses a synchronous standby instance in another zone within the same region (configured via the HA toggle, not a Read Replica). Read Replicas are asynchronous and are for offloading read traffic or cross-region Disaster Recovery (requiring manual promotion if the primary region fails)."
      },
      {
        trap: "Choosing BigQuery for high-frequency transactional row updates or low-latency (<50ms) customer-facing dashboard lookups by single user ID.",
        reality: "BigQuery is an **OLAP** columnar data warehouse optimized for petabyte-scale analytical scans (latency in seconds), NOT an OLTP database. Use **Bigtable**, **Spanner**, **AlloyDB**, or **Firestore** for sub-100ms operational queries."
      }
    ],
    cliExamples: `# Create a Cloud Storage Lifecycle rule JSON to downgrade to Coldline after 90 days and delete after 365 days
cat << 'EOF' > lifecycle.json
{
  "rule": [
    {
      "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
      "condition": {"age": 90, "matchesStorageClass": ["STANDARD", "NEARLINE"]}
    },
    {
      "action": {"type": "Delete"},
      "condition": {"age": 365}
    }
  ]
}
EOF
gcloud storage buckets update gs://my-compliance-bucket --lifecycle-file=lifecycle.json`
  },
  {
    id: "data-analytics-ml",
    category: "Data Analytics & AI/ML",
    title: "BigQuery, Pub/Sub, Dataflow, Dataproc & Vertex AI",
    icon: "bar-chart",
    domainIds: ["domain-1", "domain-4", "domain-5"],
    tagline: "Real-time streaming architectures, BigQuery cost/performance optimization, and ML pipelines.",
    overview: `A classic PCA pattern (featured heavily in Helicopter Racing League, Mountkirk Games, and TerramEarth) is the **Reference Streaming & Batch Analytics Pipeline**: Edge/IoT devices → **Pub/Sub** (global ingestion buffer) → **Dataflow** (Apache Beam stream processing, windowing, enrichment) → **BigQuery** (analytics warehouse) & **Cloud Bigtable** (low-latency operational serving) → **Looker / Vertex AI**.`,
    sections: [
      {
        heading: "1. BigQuery Architecture, Partitioning, Clustering & Security",
        content: [
          "**Storage vs. Compute Separation**: BigQuery decouples Colossus storage from Dremel compute slots. To optimize query performance and drastically reduce on-demand scan costs, **never use `SELECT *`** on columnar tables!",
          "**Partitioning & Clustering (CRITICAL FOR EXAM)**: Always **Partition** tables first (by ingestion time, `DATE`/`TIMESTAMP` column, or integer range) so queries with a `WHERE` filter prune entire partitions. Then **Cluster** on up to 4 high-cardinality filter/join columns (e.g., `customer_id`, `region`, `vehicle_id`) sorted in order of filter frequency. Enable `--require_partition_filter` on massive tables to prevent analysts from accidentally running full-table scans.",
          "**BigQuery Editions & Slot Reservations**: **On-Demand** charges per TiB scanned (unpredictable cost for large teams). **BigQuery Editions (Standard, Enterprise, Enterprise Plus)** use autoscaling **Slot Reservations** with optional 1-year or 3-year commitments for predictable flat-rate/autoscaled compute governance.",
          "**Granular Access Control in BigQuery**: Use **Authorized Views** or **Authorized Datasets** to share query results with external users without granting them access to the underlying raw tables. Use **Row-Level Security Policies** (`CREATE ROW ACCESS POLICY`) to filter rows by user/region dynamically, and **Column-Level Security (Policy Tags + Data Catalog + Cloud DLP)** to mask or restrict PII/PHI columns (like SSNs or credit cards)."
        ]
      },
      {
        heading: "2. Pub/Sub, Dataflow & Dataproc",
        content: [
          "**Cloud Pub/Sub**: Global, serverless asynchronous messaging service that decouples event producers from consumers. Supports **At-least-once** delivery (default) or **Exactly-once** delivery, **Ordering Keys** (guarantees message order per key), and **Dead-Letter Topics** (isolates poison-pill messages that repeatedly fail processing). Can ingest directly into BigQuery (**BigQuery Subscriptions**) or Cloud Storage (**Cloud Storage Subscriptions**) without needing Dataflow if no complex transformation is required!",
          "**Cloud Dataflow (Apache Beam)**: Fully managed, serverless unified **stream and batch** processing engine. Choose Dataflow when you need **event-time windowing**, **watermarks and triggers for late-arriving data** (e.g., mobile games or IoT vehicles reconnecting after hours offline), stateful aggregations, or dynamic PII redaction via Cloud DLP in flight.",
          "**Cloud Dataproc**: Managed **Apache Spark and Hadoop** service. Choose Dataproc **ONLY when migrating existing Spark/Hadoop/Hive/Presto codebases** to GCP. Architectural best practice on GCP: **Decouple storage from compute** by replacing HDFS with **Cloud Storage (`gs://`)**, using **ephemeral job-scoped clusters** (or **Dataproc Serverless**), and using **Spot VMs as secondary worker nodes** with **Enhanced Flexibility Mode (EFM)** so shuffle data stays on primary workers if Spot nodes are preempted."
        ]
      },
      {
        heading: "3. AI/ML Decision Matrix on Google Cloud",
        content: [
          "** Rule 1 (Zero ML Expertise / Pre-trained Models)**: Use **Pre-trained Cloud AI APIs** (Cloud Vision API, Cloud Natural Language API, Cloud Translation API, Speech-to-Text, Document AI) when standard capabilities suffice.",
          "**Rule 2 (Tabular / SQL-First Analysts)**: Use **BigQuery ML (BQML)** when data already lives in BigQuery and analysts want to train/infer regression, classification, k-means, time-series (`ARIMA_PLUS`), or invoke Vertex AI Gemini models directly using standard SQL queries without moving data.",
          "**Rule 3 (Custom Data, Low Code)**: Use **Vertex AI AutoML** to train custom models on your own domain-specific image, video, text, or tabular datasets without writing TensorFlow/PyTorch code.",
          "**Rule 4 (Custom Training Code & MLOps)**: Use **Vertex AI Custom Training, Vertex AI Pipelines (Kubeflow), Feature Store, and Model Monitoring** when data scientists write custom PyTorch/TensorFlow/XGBoost models requiring GPU/TPU clusters and full MLOps lifecycle tracking."
        ]
      }
    ],
    comparisonTable: {
      headers: ["Service", "Primary Role", "Handling Late Data?", "Ecosystem / API", "Exam Trigger Keywords"],
      rows: [
        ["Cloud Pub/Sub", "Global asynchronous event ingestion & messaging", "Buffers messages up to 31 days", "Pub/Sub API, Kafka-compatible option", "'Decouple microservices', 'ingest global IoT telemetry', 'absorb traffic spikes'"],
        ["Pub/Sub BigQuery Subscription", "Zero-code direct streaming into BigQuery", "Appends arrival timestamp", "Native Pub/Sub -> BQ", "'Stream JSON/Avro events directly to BigQuery with zero transformation overhead'"],
        ["Cloud Dataflow", "Serverless unified stream & batch ETL", "Yes! Event-time windows, watermarks, triggers", "Apache Beam (Java, Python, Go)", "'Late-arriving mobile/IoT data', 'windowed aggregations', 'unified batch + stream'"],
        ["Cloud Dataproc", "Managed Apache Spark & Hadoop", "Spark Structured Streaming", "Spark, Hadoop, Hive, PySpark", "'Lift-and-shift existing on-prem Spark/Hadoop jobs', 'replace HDFS with GCS'"],
        ["Cloud Composer", "Managed workflow orchestration", "Schedules/triggers DAGs", "Apache Airflow", "'Orchestrate multi-step cross-service dependencies (GCS -> Dataproc -> BQ)'"]
      ]
    },
    examTraps: [
      {
        trap: "Keeping long-running persistent Dataproc clusters with large HDFS disks running 24/7 just like an on-premises Hadoop cluster.",
        reality: "On GCP, persistent HDFS clusters waste huge amounts of money! Always store data in **Cloud Storage (`gs://`)**, spin up **ephemeral Dataproc clusters** (or use **Dataproc Serverless for Spark**) only for the duration of the job, and tear them down immediately after completion."
      },
      {
        trap: "Deploying a custom Dataflow pipeline just to copy raw untransformed Pub/Sub messages directly into a BigQuery table.",
        reality: "Use a **Pub/Sub BigQuery Subscription** instead! It writes messages straight from Pub/Sub to BigQuery with no Dataflow worker VMs to manage or pay for."
      }
    ],
    cliExamples: `# Create a partitioned and clustered BigQuery table with required partition filter
bq mk --table \\
  --time_partitioning_field=event_timestamp \\
  --time_partitioning_type=DAY \\
  --clustering_fields=vehicle_id,region \\
  --require_partition_filter=true \\
  analytics_prod.vehicle_telemetry`
  },
  {
    id: "security-iam-governance",
    category: "Security, IAM & Governance",
    title: "Zero-Trust Security, IAM, KMS, VPC-SC & Compliance",
    icon: "shield",
    domainIds: ["domain-3", "domain-1", "domain-2"],
    tagline: "Resource Hierarchy, Organization Policies, VPC Service Controls, CMEK/CSEK/EKM, and Cloud DLP.",
    overview: `Security makes up ~18% of the PCA exam directly and appears as a secondary constraint in nearly 50% of all questions. Google Cloud's security model is built on **Zero Trust (BeyondCorp)**, **Principle of Least Privilege**, **Defense in Depth**, and **Inheritance across the Resource Hierarchy**.`,
    sections: [
      {
        heading: "1. Resource Hierarchy, IAM Best Practices & Organization Policies",
        content: [
          "**Resource Hierarchy**: **Organization Node** → **Folders** (Department / Environment / Business Unit) → **Projects** (Trust & Billing Boundary) → **Resources**. IAM Allow policies are **additive (union)** down the hierarchy: if a user is granted `roles/editor` at the Folder level, you cannot revoke it with a standard Allow policy at the Project level (unless using **IAM Deny Policies**). Therefore, always grant roles at the **lowest possible resource scope** using **Predefined Roles** or **Custom Roles** instead of Basic Roles (`Owner`, `Editor`, `Viewer`).",
          "**Organization Policy Service**: While IAM controls *WHO* can act, **Organization Policies** control *WHAT* configurations are permitted across the hierarchy—even restricting Project Owners! Classic exam constraints: `constraints/compute.vmExternalIpAccess` (prevent VMs from having public IPs), `constraints/iam.disableServiceAccountKeyCreation` (block JSON key exports), `constraints/gcp.resourceLocations` (restrict data residency to specific regions like `eu-` or `us-` for GDPR/sovereignty).",
          "**Identity Federation**: Synchronize corporate Active Directory users/groups into Cloud Identity using **Google Cloud Directory Sync (GCDS)** (one-way LDAP sync of users/groups) and configure **SAML 2.0 / OIDC Single Sign-On (SSO)** so Active Directory remains the IdP and passwords never leave on-premises. Always assign IAM roles to **Google Groups**, never to individual user emails!"
        ]
      },
      {
        heading: "2. VPC Service Controls (VPC-SC) vs. Firewall Rules",
        content: [
          "**The Problem**: Managed multi-tenant APIs like **BigQuery, Cloud Storage, and Cloud Spanner** live on Google's public API plane (`*.googleapis.com`), outside your VPC subnets. Even with Private Google Access enabled, a malicious insider or stolen credential could authenticate inside your VM and copy sensitive data from your production BigQuery dataset to their personal GCP project's Cloud Storage bucket (**data exfiltration**).",
          "**The Solution — VPC Service Controls (VPC-SC)**: Creates a logical **Security Perimeter** around your GCP Projects and multi-tenant services (GCS, BigQuery, Spanner, KMS, Vertex AI). Clients outside the perimeter cannot access resources inside the perimeter, and clients inside the perimeter cannot copy data to buckets/datasets outside the perimeter. Controlled finely via **Ingress and Egress Rules** and **Access Context Manager** (device trust, corporate IP range, user identity). Use **Dry-Run Mode** first to audit potential violations in Cloud Audit Logs before enforcing!"
        ]
      },
      {
        heading: "3. Data Encryption (Default vs. CMEK vs. CSEK vs. EKM) & Cloud DLP",
        content: [
          "**Google-Managed Encryption Keys (GMEK)**: Enabled by default for 100% of data at rest and in transit in Google Cloud (AES-256). Zero configuration required.",
          "**Customer-Managed Encryption Keys (CMEK)**: Keys created and managed by you inside **Cloud KMS** (software or **Cloud HSM** FIPS 140-2/3 Level 3 hardware). Choose CMEK when compliance requires **controlling key rotation schedules**, auditing key usage, or having a cryptographic 'kill switch' to revoke access.",
          "**Customer-Supplied Encryption Keys (CSEK)**: You generate and store raw AES-256 keys on-premises and pass the key in the HTTP header of every API call (supported on GCE Persistent Disks and Cloud Storage). Google never stores the key on disk—only in RAM during the operation.",
          "**Cloud External Key Manager (Cloud EKM)**: Integrates GCP services with an external third-party key manager (Thales, Fortanix, Virtru) hosted outside Google Cloud. Choose EKM when regulations mandate **strict separation between cloud storage provider and key custody** without manually passing headers on every request.",
          "**Sensitive Data Protection (Cloud DLP)**: Discovers, classifies, and de-identifies PII/PHI (credit cards, SSNs, names, medical IDs) across Cloud Storage, BigQuery, or streaming pipelines. Key de-identification methods: **Redaction/Masking** (irreversible replacement with `*` or `[REDACTED]`), **Crypto-Deterministic Tokenization / Format-Preserving Encryption (FPE)** (replaces a 16-digit credit card or SSN with a realistic 16-digit surrogate token so **referential integrity / SQL JOINs across tables continue to work** and data can be re-identified if authorized!), and **Bucketing/Date Shifting**."
        ]
      }
    ],
    comparisonTable: {
      headers: ["Security Control", "Layer / Scope", "Primary Threat Mitigated", "Exam Trigger Keywords"],
      rows: [
        ["VPC Service Controls (VPC-SC)", "API Perimeter across Projects", "Data exfiltration from BigQuery/GCS via stolen credentials or insider threat", "'Prevent copying data to external buckets', 'multi-tenant API perimeter'"],
        ["Identity-Aware Proxy (IAP)", "Application & TCP/SSH Edge", "Unauthorized access to internal web apps or VMs without VPN", "'Zero-trust access to internal web apps', 'SSH/RDP to VMs without public IPs'"],
        ["Cloud Armor", "Global Load Balancer Edge (L3-L7)", "DDoS attacks, OWASP Top 10 (SQLi/XSS), bot scraping", "'OWASP Top 10 WAF', 'mitigate volumetric DDoS', 'geo-blocking/rate limiting'"],
        ["Organization Policies", "Org / Folder / Project Guardrails", "Shadow IT misconfigurations by developers/owners", "'Prevent external IPs across all projects', 'enforce EU data residency', 'block SA keys'"],
        ["Cloud DLP (FPE / Deterministic)", "Data Payload / Columns", "Exposure of PII/PHI in analytics or test datasets", "'De-identify PII while preserving SQL JOINs and format', 'reversible tokenization'"]
      ]
    },
    examTraps: [
      {
        trap: "Opening firewall port 22 (`0.0.0.0/0`) or deploying public Bastion Hosts just so administrators can SSH into private GCE VMs.",
        reality: "Use **Identity-Aware Proxy (IAP) TCP Forwarding** combined with **OS Login** (`enable-oslogin=TRUE`). Only allow TCP ingress on port 22 from Google's IAP range **`35.235.240.0/20`**. No public IPs, no bastion VMs to patch, and SSH access is tied directly to IAM roles (`roles/compute.osAdminLogin`) and 2FA!"
      }
    ],
    cliExamples: `# Allow SSH via Identity-Aware Proxy (IAP) TCP Forwarding only
gcloud compute firewall-rules create allow-ssh-ingress-from-iap \\
    --direction=INGRESS \\
    --action=allow \\
    --rules=tcp:22,tcp:3389 \\
    --source-ranges=35.235.240.0/20

# Connect to a private VM with no external IP using IAP tunnel
gcloud compute ssh prod-backend-vm --zone=us-central1-a --tunnel-through-iap`
  },
  {
    id: "sre-observability-dr",
    category: "SRE, Operations & DR",
    title: "SRE Principles, Observability, CI/CD & Disaster Recovery",
    icon: "activity",
    domainIds: ["domain-6", "domain-5", "domain-4"],
    tagline: "SLIs/SLOs/Error Budgets, Log Sinks, RPO/RTO DR patterns, and zero-downtime deployments.",
    overview: `Google invented Site Reliability Engineering (SRE), and Section 6 of the PCA exam tests your mastery of SRE culture, observability pipelines (Cloud Logging, Monitoring, Trace, Profiler), CI/CD release strategies, and Disaster Recovery architectures.`,
    sections: [
      {
        heading: "1. SRE Fundamentals: SLI, SLO, SLA & Error Budgets",
        content: [
          "**SLI (Service Level Indicator)**: A quantitative metric measuring a specific aspect of service behavior from the user's perspective—typically **Request Latency, Availability (successful HTTP 2xx/3xx/4xx vs 5xx ratio), Throughput, or Durability**. (Note: CPU utilization is a system metric, rarely a good user-facing SLI!).",
          "**SLO (Service Level Objective)**: The internal target value or range for an SLI over a rolling window (e.g., *'99.9% of checkout API requests in a 28-day window complete in < 200ms'*). SLOs should always be **stricter** than external SLAs to give engineers early warning.",
          "**SLA (Service Level Agreement)**: An external legal/business contract with customers defining consequences (financial credits/penalties) if availability drops below a threshold (e.g., 99.5%).",
          "**Error Budget**: `100% - SLO` (e.g., for a 99.9% SLO, the error budget is 0.1% or ~43.2 minutes of allowable downtime per month). **Exam Rule on Error Budgets**: While the Error Budget is remaining, teams can push rapid feature releases and take calculated risks. **When the Error Budget is exhausted**, feature velocity freezes and engineering effort shifts to **reliability improvements, automated testing, and bug fixes**! After any outage, always conduct a **Blameless Postmortem** focused on systemic process fixes, never punishing individuals."
        ]
      },
      {
        heading: "2. Cloud Logging Architecture: Log Router, Sinks & Audit Logs",
        content: [
          "**Cloud Audit Logs**: Four types: **Admin Activity** (always on, free, kept 400 days—tracks resource creation/deletion/IAM changes), **System Event** (always on, free, kept 400 days), **Policy Denied** (tracks VPC-SC/IAM blocks), and **Data Access** (disabled by default except for BigQuery because they are high-volume and chargeable—tracks who read/wrote data inside buckets/tables).",
          "**Log Router & Sinks**: Every log entry hits the Cloud Logging **Log Router**, which evaluates **Inclusion Filters** (what to route) and **Exclusion Filters** (what noisy debug logs to drop **before** ingestion so you don't pay storage fees!). Sinks can export logs to 4 destinations: **Cloud Logging Log Buckets**, **Cloud Storage** (cheapest for multi-year cold compliance archiving), **BigQuery** (or Linked Datasets via Log Analytics for SQL security querying), and **Pub/Sub** (for streaming into external SIEMs like Splunk, Chronicle/SecOps, or Datadog).",
          "**Aggregated Sinks**: Configured at the **Organization or Folder level** with `--include-children` to automatically capture and centralize audit logs from every existing and future Project into a central Security/Compliance project."
        ]
      },
      {
        heading: "3. Disaster Recovery (RPO vs. RTO) & Deployment Strategies",
        content: [
          "**RPO (Recovery Point Objective)**: *How much data loss can the business tolerate?* Driven by **backup/replication frequency** (e.g., RPO = 0 requires synchronous replication like Cloud Spanner or Regional PD; RPO = 1 hour allows hourly snapshots/async replication).",
          "**RTO (Recovery Time Objective)**: *How quickly must the application be back online after a disaster?* Driven by **compute readiness & automation** (Cold vs. Warm vs. Hot standby).",
          "**Cloud Trace vs. Cloud Profiler**: **Cloud Trace** measures distributed request latency across microservices (finding *which* downstream service or RPC call is slow). **Cloud Profiler** continuously samples **CPU and memory heap usage** inside a specific application's code in production with <1% overhead (finding *which function or line of code* is consuming excessive CPU/RAM)."
        ]
      }
    ],
    comparisonTable: {
      headers: ["DR Pattern", "RTO", "RPO", "Cost", "GCP Architecture Implementation"],
      rows: [
        ["Backup & Restore (Cold)", "Hours to Days", "Hours (since last backup)", "$ (Lowest)", "Snapshots/backups in multi-region GCS; provision infrastructure via Terraform only during disaster"],
        ["Pilot Light (Warm-Minimal)", "10s of Minutes", "Seconds to Minutes", "$$", "Core DB replication running continuously (Cloud SQL cross-region replica); app MIG scaled to 0 or 1 until failover"],
        ["Warm Standby", "Minutes", "Seconds", "$$$", "Scaled-down but fully functional secondary region running live traffic health checks; scales up on DNS/LB switch"],
        ["Hot / Multi-Region Active-Active", "Near Zero (Seconds)", "Zero (Synchronous)", "$$$$ (Highest)", "Global External App LB + multi-region GKE/Cloud Run + Cloud Spanner multi-region"]
      ]
    },
    examTraps: [
      {
        trap: "Using Cloud Trace when a question asks why a specific Java/Go microservice has high CPU utilization or memory leaks in production.",
        reality: "**Cloud Trace** is for request latency across distributed services. **Cloud Profiler** is for pinpointing which specific functions/methods inside your code are consuming CPU cycles or memory!"
      },
      {
        trap: "Exporting 7 years of compliance audit logs to BigQuery when the prompt says 'minimize cost for logs that are rarely or never queried'.",
        reality: "For long-term archival with minimal cost, route logs via a Sink to a **Cloud Storage Archive bucket** (with a Bucket Lock retention policy if required). Only route to **BigQuery** if auditors require frequent interactive SQL analysis."
      }
    ],
    cliExamples: `# Create an Organization-level Aggregated Log Sink for all audit logs to a central GCS Archive bucket
gcloud logging sinks create org-compliance-audit-sink \\
    storage.googleapis.com/corp-central-audit-archive-bucket \\
    --organization=123456789012 \\
    --include-children \\
    --log-filter='logName:"logs/cloudaudit.googleapis.com"'`
  }
];
