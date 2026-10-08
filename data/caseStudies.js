export const CASE_STUDIES = [
  {
    id: "ehr-healthcare",
    name: "EHR Healthcare",
    industry: "Healthcare & Electronic Health Records (SaaS)",
    badgeColor: "#EA4335",
    shortDesc: "Leading provider of electronic health record software migrating from expiring colocation leases to Google Cloud with strict HIPAA compliance, hybrid connectivity, and multi-cluster resilience.",
    companyOverview: `EHR Healthcare is a leading provider of electronic health record (EHR) software to the medical industry. EHR Healthcare provides their software as a Software-as-a-Service (SaaS) product to multi-national medical offices, hospitals, and insurance providers. Due to rapid growth and expiring leases on several colocation data centers, EHR Healthcare needs to migrate their environments to Google Cloud while maintaining hybrid connectivity to remaining on-premises legacy systems.`,
    existingEnvironment: [
      "**Data Centers**: Software is currently hosted in multiple colocation data centers. One primary data center lease is expiring soon and must be migrated urgently.",
      "**Compute & Apps**: Customer-facing web/API applications are containerized (Kubernetes) alongside legacy VM-based services. Administration of Kubernetes clusters across data centers is manual and inconsistent.",
      "**Databases**: Diverse database footprint including Microsoft SQL Server, MySQL, MongoDB, and Redis.",
      "**Identity**: Microsoft Active Directory manages corporate users and administrators on-premises.",
      "**Observability**: Monitoring, logging, and alerting are fragmented across multiple third-party tools, causing slow root-cause detection during outages."
    ],
    businessRequirements: [
      "On-board new insurance providers as quickly as possible",
      "Provide a minimum 99.9% availability for all customer-facing systems",
      "Centralize visibility and proactive insights into ingestion system performance and anomalous behavior",
      "Increase ability to generate healthcare trend insights (predictions, anomalies) while protecting PHI",
      "Reduce latency to all end users worldwide",
      "Maintain regulatory compliance (HIPAA / HITECH / GDPR where applicable)",
      "Decrease infrastructure administration costs and capex commitments"
    ],
    technicalRequirements: [
      "Maintain a consistent interface to manage container-based workloads both on-premises and in the cloud",
      "Provide a secure, high-performance connection between on-premises data centers and Google Cloud",
      "Ensure consistent logging, log retention, monitoring, and tracing across all services",
      "Manage multiple deployment environments (Dev, Test, Prod) with automated, repeatable CI/CD pipelines",
      "Ensure interfaces that ingest data from external partners are scalable, standardized, and secured"
    ],
    architectureBlueprint: {
      diagramSteps: [
        "On-Premises Data Centers <--[Dedicated/Partner Interconnect + HA VPN for IPSec Encryption]--> Google Cloud Shared VPC",
        "Active Directory <--[GCDS + SAML SSO]--> Cloud Identity & IAM (Google Groups + Least Privilege)",
        "External Partner APIs / Insurance Onboarding --> Apigee API Management + Cloud Armor + Global Application Load Balancer",
        "Compute Layer: GKE Enterprise (Anthos) across Cloud & On-Premises + Binary Authorization + Workload Identity",
        "Database Layer: Cloud SQL (MySQL & SQL Server with HA), Firestore (replacing MongoDB), Memorystore for Redis",
        "HIPAA Analytics Pipeline: Pub/Sub --> Dataflow + Cloud DLP (PHI De-identification) --> BigQuery --> Vertex AI"
      ],
      mappings: [
        {
          requirement: "Secure, high-performance hybrid connection for sensitive medical records (HIPAA)",
          gcpSolution: "Dedicated Interconnect (or Partner Interconnect) with **HA VPN layered on top** (or MACsec) to ensure encryption in transit",
          why: "Interconnect provides high bandwidth & low latency, but traffic is unencrypted by default. Layering HA VPN over Interconnect VLAN attachments satisfies HIPAA encryption-in-transit requirements with a 99.99% SLA."
        },
        {
          requirement: "Consistent management of containerized apps across remaining on-prem data centers and GCP",
          gcpSolution: "**GKE Enterprise (Anthos)** with Fleet Management, Config Sync, and Service Mesh",
          why: "Provides a single control plane, unified policy enforcement, and GitOps configuration sync across both on-premises Kubernetes clusters and cloud GKE clusters."
        },
        {
          requirement: "Fast onboarding of new insurance providers & standardized external APIs",
          gcpSolution: "**Apigee API Management** in front of GKE backends",
          why: "Apigee provides a developer portal for rapid self-service partner onboarding, OAuth2/mTLS security, rate limiting/quotas, and API analytics."
        },
        {
          requirement: "Migrate MySQL, MS SQL Server, Redis, and MongoDB with minimal operational overhead",
          gcpSolution: "**Cloud SQL for MySQL & SQL Server (Regional HA)**, **Memorystore for Redis**, and **Firestore** (or MongoDB Atlas on GCP)",
          why: "Replaces self-managed database VMs with fully managed regional HA services. Use Database Migration Service (DMS) for MySQL and SQL Server backups/replication."
        },
        {
          requirement: "Generate healthcare trend insights and predictions while protecting PHI (HIPAA)",
          gcpSolution: "**Sensitive Data Protection (Cloud DLP)** -> **BigQuery** -> **Vertex AI** (covered by Google Cloud BAA)",
          why: "Cloud DLP de-identifies/tokenizes PHI (e.g., Crypto-Deterministic / FPE tokenization or Date Shifting) before storing analytical datasets in BigQuery for Vertex AI training."
        },
        {
          requirement: "Keep existing Active Directory as the single source of truth for employee identity",
          gcpSolution: "**Google Cloud Directory Sync (GCDS)** + **Active Directory Federation Services (ADFS) / SAML SSO**",
          why: "GCDS synchronizes users and groups one-way into Cloud Identity, while SAML SSO delegates authentication back to on-premises Active Directory."
        }
      ]
    },
    examTraps: [
      "Never store raw unredacted PHI in non-HIPAA-compliant environments or allow developers in Dev/Test projects to query production PHI directly—use **Cloud DLP** to de-identify data and **VPC Service Controls** around production BigQuery/GCS.",
      "If a question asks how to encrypt traffic over EHR's Dedicated Interconnect, remember that **Dedicated Interconnect does NOT encrypt traffic automatically**—you must configure **HA VPN over Cloud Interconnect** (or MACsec)."
    ]
  },
  {
    id: "helicopter-racing-league",
    name: "Helicopter Racing League (HRL)",
    industry: "Global Sports Media, Live Streaming & Real-Time Telemetry",
    badgeColor: "#4285F4",
    shortDesc: "Global sports league streaming live helicopter races, ingesting real-time sensor telemetry from race trucks around the world, and serving low-latency AI predictions to viewers.",
    companyOverview: `Helicopter Racing League (HRL) is a global sports league for competitive helicopter racing. Each year HRL holds the world championship and several regional league competitions where teams compete to earn a spot in the world championship. HRL offers a paid streaming service for fans worldwide featuring live race video, real-time telemetry leaderboards, and predictive AI insights (such as overtake probability and mechanical failure risk).`,
    existingEnvironment: [
      "**Public Cloud-First**: HRL runs primarily in a public cloud already, using VM-based container clusters and object storage, and wants to migrate to Google Cloud to modernize its media and ML stack.",
      "**Edge Race Trucks**: Video encoding and initial telemetry aggregation happen on local compute clusters inside mobile **race trucks** parked at race locations (often with constrained or variable local connectivity).",
      "**Batch-Only ML**: Currently, race predictions and post-race analytics run on VM-based batch jobs that take hours, preventing real-time predictive overlays during live broadcasts."
    ],
    businessRequirements: [
      "Migrate existing workloads to Google Cloud to reduce operational overhead and improve global viewer reliability",
      "Expand global reach with low-latency video streaming and interactive telemetry for fans on every continent",
      "Provide real-time AI/ML predictions during races (e.g., lap time, battery/fuel consumption, crowd sentiment)",
      "Monetize historical race data and video archives by exposing secure APIs to broadcast partners and sponsors",
      "Increase predictive capabilities during and before races (mechanical failure detection, weather impact)"
    ],
    technicalRequirements: [
      "Ingest real-time sensor telemetry from helicopters during races with ultra-low latency",
      "Transcode and distribute live and recorded high-definition video globally with minimal buffering",
      "Support edge computing inside mobile race trucks that sync seamlessly with Google Cloud",
      "Enable data scientists to rapidly train, deploy, and serve low-latency ML models at scale"
    ],
    architectureBlueprint: {
      diagramSteps: [
        "Helicopter Sensors & Race Truck Edge (Google Distributed Cloud Edge / GKE Enterprise) --> Cloud Pub/Sub (Global Ingestion)",
        "Pub/Sub Stream --> Cloud Dataflow (Real-Time Windowed Enrichment & Real-Time ML Inference via Vertex AI Endpoints)",
        "Hot Operational Telemetry (<10ms Read/Write) --> Cloud Bigtable (Powering Live Viewer Leaderboards)",
        "Historical Analytics & Sponsor Queries --> BigQuery (Partitioned by Race Date, Clustered by Helicopter ID)",
        "Live Video Feed --> Live Stream API / Transcoder API --> Cloud Storage --> Global External ALB + Cloud CDN",
        "Partner / Sponsor Monetization --> Apigee API Gateway + BigQuery Authorized Views"
      ],
      mappings: [
        {
          requirement: "Ingest high-velocity real-time telemetry from helicopters and serve live viewer dashboards with <10ms latency",
          gcpSolution: "**Cloud Pub/Sub** -> **Cloud Dataflow** -> **Cloud Bigtable** (hot serving) + **BigQuery** (historical OLAP)",
          why: "Pub/Sub buffers global spikes; Dataflow processes streaming windows; Bigtable handles massive time-series writes and millisecond reads for live race telemetry."
        },
        {
          requirement: "Global low-latency live and on-demand video streaming to millions of concurrent fans",
          gcpSolution: "**Cloud Storage** + **Live Stream API / Transcoder API** + **Global External Application Load Balancer with Cloud CDN**",
          why: "Cloud CDN caches video segments (HLS/DASH) at 100+ Google Edge PoPs worldwide, offloading origin storage and minimizing viewer latency."
        },
        {
          requirement: "Real-time ML predictions (overtake probability, mechanical failure, sentiment analysis) during races",
          gcpSolution: "**Vertex AI** (Custom Training / AutoML + **Vertex AI Online Prediction Endpoints**) invoked from **Dataflow** (`RunInference`) or backend APIs",
          why: "Vertex AI Endpoints auto-scale with GPU acceleration to serve low-latency online predictions during live events."
        },
        {
          requirement: "Expose historical telemetry and race insights to sponsors and media partners securely with monetization",
          gcpSolution: "**Apigee API Management** + **BigQuery Authorized Views** (or Signed URLs for video assets)",
          why: "Apigee natively supports API product monetization, rate limiting, and developer portals, while Authorized Views restrict partners to their licensed data slices."
        }
      ]
    },
    examTraps: [
      "Do NOT use Cloud SQL or BigQuery as the primary write target for high-frequency millisecond helicopter sensor streams—always use **Cloud Pub/Sub -> Cloud Dataflow -> Cloud Bigtable** for hot time-series telemetry.",
      "When HRL wants to allow external broadcast partners to download large raw 4K video files from Cloud Storage without creating Google accounts for them, use **Cloud Storage Signed URLs** with a short expiration duration."
    ]
  },
  {
    id: "mountkirk-games",
    name: "Mountkirk Games",
    industry: "Online Mobile Gaming & Real-Time Multiplayer Backends",
    badgeColor: "#34A853",
    shortDesc: "Maker of session-based multiplayer mobile games needing massive dynamic autoscaling, global transactional consistency, global leaderboards, and late-arriving mobile telemetry ingestion.",
    companyOverview: `Mountkirk Games makes online, session-based, multiplayer games for mobile platforms. They have recently started building a new multiplayer game that they expect to be very popular across multiple regions globally. Historically, their previous game suffered severe outages and data loss when unexpected player surges overwhelmed their single-region MySQL database and slow-scaling VM clusters.`,
    existingEnvironment: [
      "**Previous Architecture Issues**: Recently migrated an older game to Google Cloud using fixed VM groups, a regional MySQL database, and periodic batch file uploads of game logs to BigQuery.",
      "**Pain Points**: VM scaling took too long during viral player spikes; the regional MySQL database hit write bottlenecks; and mobile analytics files uploaded in batches caused corrupt/dropped records and delayed executive insights."
    ],
    businessRequirements: [
      "Support multiple regions globally with ultra-low latency for game sessions",
      "Scale backend game servers and databases dynamically up and down based on player activity to minimize cost during off-peak hours",
      "Provide near real-time game analytics (player churn, in-game purchases, level difficulty adjustments) so designers can tune the game live",
      "Maintain a unified, strongly consistent global player profile, inventory, and leaderboard"
    ],
    technicalRequirements: [
      "Dynamically scale compute based on game server load",
      "Publish near real-time global leaderboards to millions of players",
      "Store player state and transactional game data in a globally consistent relational/transactional database",
      "Ingest streaming mobile telemetry events that may arrive **late or out of order** due to flaky mobile cellular connections",
      "Store historical game activity logs in a structured SQL warehouse for analyst queries"
    ],
    architectureBlueprint: {
      diagramSteps: [
        "Mobile Game Clients (UDP/TCP Game Traffic) --> Global Proxy / Passthrough Network LB --> Multi-Region GKE Clusters (Agones / GKE Autopilot)",
        "Global Player Profiles & In-Game Purchases (ACID SQL) --> Cloud Spanner (Multi-Region Instance)",
        "Fast Real-Time Global Leaderboards --> Memorystore for Redis (Sorted Sets)",
        "Mobile Telemetry Events (including offline/late events) --> Cloud Pub/Sub --> Cloud Dataflow (Event-Time Windowing, Watermarks & Triggers) --> BigQuery"
      ],
      mappings: [
        {
          requirement: "Globally consistent transactional database for player state, inventory, and purchases across multiple regions",
          gcpSolution: "**Cloud Spanner** (Multi-region configuration) or **Firestore** (if document-oriented)",
          why: "Mountkirk explicitly requires a relational/transactional database that scales writes horizontally across multiple regions without MySQL sharding bottlenecks—Cloud Spanner is the textbook solution."
        },
        {
          requirement: "Handle mobile telemetry events that arrive minutes or hours late due to intermittent mobile connectivity",
          gcpSolution: "**Cloud Pub/Sub** -> **Cloud Dataflow** (using **Event-Time Windowing, Watermarks, and Allowed Lateness Triggers**) -> **BigQuery**",
          why: "Dataflow (Apache Beam) natively separates Event Time (when the action happened on the phone) from Processing Time (when the server received it), accurately placing late data into the right analytical window."
        },
        {
          requirement: "Rapidly scale containerized game servers across multiple global regions",
          gcpSolution: "**Google Kubernetes Engine (GKE)** with Horizontal Pod Autoscaler (HPA) & Cluster Autoscaler / Node Auto-Provisioning (plus Multi-Cluster Ingress/Gateway)",
          why: "Containers start in seconds compared to minutes for full VM boot cycles, allowing Mountkirk to absorb sudden viral player spikes."
        },
        {
          requirement: "Ultra-fast real-time global leaderboards updated thousands of times per second",
          gcpSolution: "**Memorystore for Redis** (using Redis Sorted Sets `ZADD`/`ZRANGE`)",
          why: "In-memory Redis Sorted Sets compute rankings and top-N leaderboards at sub-millisecond latency without overloading Spanner or BigQuery."
        }
      ]
    },
    examTraps: [
      "Whenever a Mountkirk Games question mentions **'late-arriving data from mobile devices'** or **'out-of-order events due to lost cellular connectivity'**, the answer ALWAYS involves **Cloud Pub/Sub + Cloud Dataflow** (with watermarks/windowing)—never batch GCS uploads or cron jobs!",
      "If Mountkirk's Cloud Spanner database experiences high latency during peak writes, check the Primary Key schema: using a **monotonically increasing integer or timestamp** as the primary key causes **hotspotting**. Fix it by using a **UUID v4** or **hash prefix**."
    ]
  },
  {
    id: "terramearth",
    name: "TerramEarth",
    industry: "Heavy Industrial IoT, Agriculture & Mining Equipment",
    badgeColor: "#FBBC04",
    shortDesc: "Manufacturer of 20 million heavy industrial vehicles streaming cellular IoT telemetry and uploading massive compressed batch data over maintenance ports, building an open partner API ecosystem.",
    companyOverview: `TerramEarth manufactures heavy equipment for the mining and agricultural industries. They currently have 20 million vehicles in operation across 100+ countries. 200,000 (1%) of these vehicles are connected via cellular networks and stream real-time telemetry (500 fields per second). The remaining 99% are unconnected in the field and upload compressed batch sensor data via local maintenance ports when returning to dealer depots.`,
    existingEnvironment: [
      "**Dual Ingestion Path**: 1) **Connected cellular vehicles** send real-time streaming telemetry (9 TB/day currently, growing rapidly as more vehicles get cellular modules). 2) **Unconnected vehicles** upload gzipped CSV files at service centers via FTP/maintenance ports.",
      "**Legacy Bottlenecks**: Existing FTP servers and monolithic ETL scripts struggle with growing data volume. Data warehouse queries by dealerships and internal analysts are slow and expensive.",
      "**Developer Ecosystem**: TerramEarth wants third-party dealerships and partner developers to build custom apps on top of vehicle data via a secure API platform."
    ],
    businessRequirements: [
      "Predict and detect vehicle mechanical breakdowns before they occur to reduce unplanned downtime for customers",
      "Decrease cloud operational and storage costs as connected vehicle volume grows 10x–100x",
      "Create a monetizable partner developer ecosystem with secure, self-service API access for dealerships",
      "Improve software delivery velocity and reliability for internal engineering teams"
    ],
    technicalRequirements: [
      "Support both real-time streaming ingestion (cellular vehicles) and large batch uploads (depot maintenance ports)",
      "Optimize storage lifecycle costs for multi-petabyte historical telemetry archives (active for 30–90 days, rarely accessed afterward)",
      "Securely expose APIs to external partner developers without exposing internal backend infrastructure",
      "Enable ML models to run predictive maintenance using both historical BigQuery data and live telemetry"
    ],
    architectureBlueprint: {
      diagramSteps: [
        "Path A (Cellular Streaming Vehicles): MQTT/HTTPS Bridge --> Cloud Pub/Sub --> Cloud Dataflow --> BigQuery & Cloud Bigtable",
        "Path B (Depot Batch Uploads): Signed URLs / gsutil -m --> Cloud Storage (Standard -> Coldline/Archive Lifecycle) --> Dataflow Batch / BigQuery Load",
        "Predictive Maintenance ML: BigQuery + Vertex AI Training --> Vertex AI Endpoints (Online & Batch Predictions)",
        "Dealer & Partner Developer Platform: Apigee API Management (OAuth2, Rate Limiting, Developer Portal) --> Cloud Run / GKE Microservices"
      ],
      mappings: [
        {
          requirement: "Unified analytics pipeline for both streaming cellular telemetry and delayed depot batch files",
          gcpSolution: "**Cloud Dataflow (Apache Beam)** reading from **Cloud Pub/Sub** (stream) and **Cloud Storage** (batch) into **BigQuery**",
          why: "Apache Beam / Dataflow allows TerramEarth to write unified transformation and enrichment logic in a single codebase that runs on both streaming Pub/Sub data and batch GCS files."
        },
        {
          requirement: "Minimize storage and query costs for petabytes of historical telemetry rarely queried after 90 days",
          gcpSolution: "**BigQuery Partitioned & Clustered Tables** (automatic **Long-Term Storage** 50% discount after 90 days unmodified) + **Cloud Storage Lifecycle Management** (transitioning raw files to Coldline/Archive)",
          why: "In BigQuery, any partition not modified for 90 consecutive days automatically drops in storage price by ~50% with zero degradation in query performance!"
        },
        {
          requirement: "Build an external partner API ecosystem with dealer onboarding, rate limiting, and security",
          gcpSolution: "**Apigee API Management**",
          why: "Provides developer portal, API keys, OAuth 2.0, spike arrest, quota management, and analytics for third-party dealers."
        },
        {
          requirement: "Accelerate slow batch uploads of large compressed maintenance files from remote dealerships",
          gcpSolution: "**Cloud Storage** with **Transfer Acceleration / Parallel Composite Uploads (`gcloud storage cp` / `gsutil -m`)** and **Signed URLs**",
          why: "Eliminates central FTP server bottlenecks by uploading directly to Google's global edge PoPs using parallel multi-threaded transfers."
        }
      ]
    },
    examTraps: [
      "Remember **BigQuery Long-Term Storage Pricing**: If a TerramEarth question asks how to reduce storage cost for BigQuery partitions older than 90 days while keeping them immediately queryable via SQL, you do NOT need to export them to Cloud Storage! Simply partition the table by date and avoid editing old partitions—BigQuery automatically cuts storage cost by ~50% after 90 days.",
      "Do not use `INSERT`/`UPDATE` statements on historical partitions if you want to preserve BigQuery's 90-day long-term storage discount, because any modification resets the 90-day timer for that partition."
    ]
  }
];
