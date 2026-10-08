export const EXAM_QUESTIONS = [
  // ================= CASE STUDY: EHR HEALTHCARE =================
  {
    id: "q-ehr-1",
    domainId: "domain-1",
    caseStudyId: "ehr-healthcare",
    difficulty: "Hard",
    multiSelect: false,
    stem: "For this question, refer to the EHR Healthcare case study. EHR Healthcare has provisioned a 2x10 Gbps Dedicated Interconnect between their primary on-premises colocation facility and Google Cloud to migrate patient medical records. Their compliance officer notes that under HIPAA policies, all network traffic carrying electronic Protected Health Information (ePHI) between on-premises systems and Google Cloud must be encrypted in transit at the network layer with a 99.99% availability SLA. What should you configure?",
    options: [
      { id: "A", text: "Enable Private Google Access for on-premises hosts on the Dedicated Interconnect VLAN attachments." },
      { id: "B", text: "Deploy HA VPN over the Dedicated Interconnect VLAN attachments using Cloud Router for dynamic BGP routing." },
      { id: "C", text: "Replace the Dedicated Interconnect with two Classic Cloud VPN tunnels configured with policy-based routing." },
      { id: "D", text: "Configure VPC Service Controls around the Google Cloud project hosting the Dedicated Interconnect." }
    ],
    correctIds: ["B"],
    explanation: "Dedicated Interconnect does NOT encrypt traffic by default. To meet strict regulatory encryption-in-transit requirements at the network layer while preserving the high reliability and dedicated bandwidth of Cloud Interconnect, Google Cloud supports deploying **HA VPN over Cloud Interconnect** (or MACsec). When paired with redundant VLAN attachments across two edge availability domains and Cloud Router, HA VPN over Interconnect provides IPSec encryption and a 99.99% SLA.",
    optionBreakdown: {
      A: "Incorrect. Private Google Access for on-premises hosts routes API traffic privately over the Interconnect, but does not add IPSec link-layer encryption to general VPC traffic.",
      B: "Correct. HA VPN over Cloud Interconnect encrypts traffic traversing the Interconnect VLAN attachments using IPSec while maintaining the 99.99% availability architecture.",
      C: "Incorrect. Classic VPN is deprecated for new architectures, lacks the 99.99% SLA, and runs over the public internet rather than utilizing the provisioned Dedicated Interconnect.",
      D: "Incorrect. VPC Service Controls create an API perimeter against data exfiltration; they do not encrypt Layer 3 hybrid network links."
    }
  },
  {
    id: "q-ehr-2",
    domainId: "domain-2",
    caseStudyId: "ehr-healthcare",
    difficulty: "Hard",
    multiSelect: false,
    stem: "For this question, refer to the EHR Healthcare case study. One of EHR Healthcare's colocation leases is expiring in 60 days, while two other on-premises data centers will continue operating for the next two years. EHR wants a single, consistent platform to manage, secure, and deploy their containerized microservices across both the remaining on-premises Kubernetes clusters and their new Google Cloud environment, including automated policy enforcement. What should you recommend?",
    options: [
      { id: "A", text: "Migrate all expiring data center workloads to Cloud Run and use Terraform to manage the remaining on-premises Kubernetes clusters separately." },
      { id: "B", text: "Adopt GKE Enterprise (Anthos) with Fleet Management, Config Sync, and Policy Controller across both GKE on Google Cloud and the on-premises Kubernetes clusters." },
      { id: "C", text: "Deploy Compute Engine Managed Instance Groups in Google Cloud and use Migrate to Virtual Machines for the Kubernetes worker nodes." },
      { id: "D", text: "Create a stretched Kubernetes cluster spanning on-premises nodes and Google Cloud Compute Engine VMs over Dedicated Interconnect." }
    ],
    correctIds: ["B"],
    explanation: "EHR Healthcare's technical requirements explicitly state: *'Maintain a consistent interface to manage container-based workloads both on-premises and in the cloud.'* **GKE Enterprise (Anthos)** registers both cloud GKE clusters and on-premises clusters into a unified Fleet, using **Config Sync** (GitOps) and **Policy Controller** for consistent configuration and compliance across hybrid environments.",
    optionBreakdown: {
      A: "Incorrect. Using Cloud Run on GCP and standalone Kubernetes on-premises violates the requirement for a consistent management interface across both environments.",
      B: "Correct. GKE Enterprise (Anthos) provides a single pane of glass, unified service mesh, and GitOps policy enforcement across on-prem and GCP clusters.",
      C: "Incorrect. Lifting and shifting Kubernetes worker nodes as VMs into GCE MIGs increases operational overhead instead of using managed GKE.",
      D: "Incorrect. Stretching a single Kubernetes control plane across on-premises and cloud over WAN links is an anti-pattern due to etcd latency sensitivity."
    }
  },
  {
    id: "q-ehr-3",
    domainId: "domain-3",
    caseStudyId: "ehr-healthcare",
    difficulty: "Hard",
    multiSelect: false,
    stem: "For this question, refer to the EHR Healthcare case study. EHR Healthcare's data science team wants to analyze historical patient admission records alongside medical billing tables in BigQuery to predict hospital readmission trends. Both tables use the patient's Social Security Number (`ssn`) as the join key. Due to HIPAA regulations, data scientists must not see real SSNs or patient names, but they still must be able to execute SQL `JOIN` queries across both tables in BigQuery. What should you do?",
    options: [
      { id: "A", text: "Use Sensitive Data Protection (Cloud DLP) to redact the `ssn` and `patient_name` columns with `[REDACTED]` before loading the tables into BigQuery." },
      { id: "B", text: "Use Sensitive Data Protection (Cloud DLP) to redact `patient_name` and apply Crypto-Deterministic Tokenization (or Format-Preserving Encryption) with a shared key stored in Cloud KMS to the `ssn` column across both tables." },
      { id: "C", text: "Encrypt both BigQuery tables using Customer-Managed Encryption Keys (CMEK) and grant the data scientists `roles/bigquery.dataViewer`." },
      { id: "D", text: "Apply Cloud DLP Date Shifting to the `ssn` column and store the raw tables in a Coldline Cloud Storage bucket." }
    ],
    correctIds: ["B"],
    explanation: "When de-identifying a sensitive column (like `ssn`) that must still function as a foreign/primary key for SQL `JOIN` operations across multiple tables, **Crypto-Deterministic Tokenization** or **Format-Preserving Encryption (FPE)** is required. Using the same KMS-wrapped cryptographic key ensures that identical input SSNs always map to the exact same surrogate token in both tables, preserving referential integrity without exposing real PHI.",
    optionBreakdown: {
      A: "Incorrect. Simple redaction replaces every SSN with the literal string `[REDACTED]`, destroying cardinality and making SQL JOINs impossible.",
      B: "Correct. Deterministic encryption/tokenization replaces SSNs with consistent surrogate tokens so tables can still be joined while hiding actual PHI.",
      C: "Incorrect. CMEK encrypts data at rest on disk; any user with `roles/bigquery.dataViewer` sees the decrypted plaintext SSNs when running a query.",
      D: "Incorrect. Date Shifting only works on date/timestamp fields, not Social Security Numbers."
    }
  },
  {
    id: "q-ehr-4",
    domainId: "domain-5",
    caseStudyId: "ehr-healthcare",
    difficulty: "Medium",
    multiSelect: false,
    stem: "For this question, refer to the EHR Healthcare case study. EHR Healthcare wants to meet its business requirement to onboard new insurance providers as quickly as possible while ensuring that external ingestion interfaces are standardized, rate-limited, secured with OAuth 2.0, and monitored for anomalous traffic spikes. Which architecture should you implement?",
    options: [
      { id: "A", text: "Expose the backend GKE pods directly using a Regional Passthrough Network Load Balancer and distribute static firewall IP allowlists to each insurance provider." },
      { id: "B", text: "Deploy Apigee API Management in front of the ingestion microservices, publish interactive OpenAPI specs in an Apigee Developer Portal, and configure Spike Arrest and OAuth 2.0 policies." },
      { id: "C", text: "Create a Shared VPC with each insurance provider's external cloud environment so they can write directly to EHR's Cloud SQL database." },
      { id: "D", text: "Give each insurance provider an IAM Service Account JSON key with `roles/pubsub.publisher` to push records directly into internal topics." }
    ],
    correctIds: ["B"],
    explanation: "**Apigee API Management** directly addresses EHR Healthcare's requirements to rapidly onboard external insurance partners (via a self-service Developer Portal), standardize API interfaces, enforce OAuth 2.0 authentication and Spike Arrest/Quota policies, and provide centralized API analytics and anomaly detection.",
    optionBreakdown: {
      A: "Incorrect. Passthrough NLBs lack Layer 7 API management, OAuth 2.0 validation, developer onboarding portals, and application-level rate limiting.",
      B: "Correct. Apigee provides full lifecycle API management, partner developer portals, OAuth2/JWT security, rate limiting, and API traffic analytics.",
      C: "Incorrect. Shared VPC only works within a single GCP Organization and exposing internal databases directly to external third parties is a severe security violation.",
      D: "Incorrect. Distributing static Service Account JSON keys to external third parties is a major security anti-pattern and lacks API standardization."
    }
  },

  // ================= CASE STUDY: HELICOPTER RACING LEAGUE (HRL) =================
  {
    id: "q-hrl-1",
    domainId: "domain-1",
    caseStudyId: "helicopter-racing-league",
    difficulty: "Hard",
    multiSelect: false,
    stem: "For this question, refer to the Helicopter Racing League (HRL) case study. During a live race, each helicopter streams thousands of sensor telemetry readings per second (altitude, rotor RPM, oil pressure, GPS coordinates, fuel flow) from the race truck edge to Google Cloud. HRL needs to ingest this stream, enrich it with real-time ML failure predictions, serve the latest millisecond metrics to the live fan mobile app leaderboard, and store all records for long-term SQL analytics by sponsors. Which pipeline architecture should you design?",
    options: [
      { id: "A", text: "Ingest via Cloud Pub/Sub -> Process & call Vertex AI Endpoints in Cloud Dataflow -> Write hot real-time state to Cloud Bigtable and historical records to BigQuery." },
      { id: "B", text: "Ingest via Cloud Storage batch uploads -> Process in Cloud Dataproc -> Write to Cloud SQL for MySQL and BigQuery." },
      { id: "C", text: "Write sensor telemetry directly from helicopters to a single-region Cloud SQL for PostgreSQL instance -> Replicate to BigQuery using Datastream." },
      { id: "D", text: "Ingest via Cloud Pub/Sub -> Use Cloud Functions to insert each sensor reading via individual `INSERT` statements into BigQuery -> Query BigQuery directly from the fan mobile app every second." }
    ],
    correctIds: ["A"],
    explanation: "This is the signature HRL architecture: **Cloud Pub/Sub** buffers global streaming telemetry from race trucks; **Cloud Dataflow** performs low-latency stream processing and invokes **Vertex AI Endpoints** for in-flight predictions; **Cloud Bigtable** handles high-velocity time-series writes and sub-10ms reads for the live viewer app; and **BigQuery** stores the historical data for analytical SQL queries.",
    optionBreakdown: {
      A: "Correct. Combines Pub/Sub, Dataflow, Vertex AI, Bigtable (sub-10ms operational serving), and BigQuery (OLAP analytics).",
      B: "Incorrect. Batch uploads to GCS and Dataproc cannot satisfy real-time millisecond telemetry and live race prediction requirements.",
      C: "Incorrect. A single Cloud SQL instance would be overwhelmed by high-velocity time-series sensor writes and lacks global edge ingestion.",
      D: "Incorrect. Querying BigQuery directly from millions of fan mobile apps every second would be prohibitively slow (seconds of latency) and expensive."
    }
  },
  {
    id: "q-hrl-2",
    domainId: "domain-4",
    caseStudyId: "helicopter-racing-league",
    difficulty: "Medium",
    multiSelect: false,
    stem: "For this question, refer to the Helicopter Racing League (HRL) case study. HRL stores petabytes of raw 4K/8K race video recordings in Cloud Storage. Fans frequently watch videos from the current race season (first 30 days), occasionally watch highlights from earlier in the year (30 to 90 days), and almost never access raw footage after 90 days—though HRL must retain all footage indefinitely for archival licensing. How should you minimize storage costs automatically?",
    options: [
      { id: "A", text: "Configure a Cloud Storage Object Lifecycle Management policy (or enable Autoclass) to transition objects from Standard to Nearline after 30 days, and to Archive after 90 days." },
      { id: "B", text: "Store all raw video files as BLOB columns inside a partitioned BigQuery table to take advantage of 90-day long-term storage pricing." },
      { id: "C", text: "Write a weekly Cloud Run Job that downloads videos older than 90 days, compresses them with gzip, and uploads them to a Persistent Disk snapshot." },
      { id: "D", text: "Keep all videos in Standard storage class and purchase a 3-year Compute Engine Committed Use Discount." }
    ],
    correctIds: ["A"],
    explanation: "For unstructured media files (4K/8K video) in Cloud Storage with predictable access decay, **Object Lifecycle Management** (or **Cloud Storage Autoclass**) automatically transitions objects from **Standard** (hot, 0–30 days) → **Nearline** (30–90 days) → **Coldline/Archive** (>90 days) without changing object URLs or requiring manual scripts.",
    optionBreakdown: {
      A: "Correct. Lifecycle rules (or Autoclass) automate storage class transitions seamlessly to minimize cost per GB.",
      B: "Incorrect. Never store multi-gigabyte video binaries inside BigQuery columns; Cloud Storage is purpose-built for unstructured media.",
      C: "Incorrect. Video codecs (H.264/HEVC) are already compressed, and Persistent Disk snapshots are meant for VM block disks, not object media archives.",
      D: "Incorrect. Compute Engine CUDs do not discount Cloud Storage object storage costs."
    }
  },
  {
    id: "q-hrl-3",
    domainId: "domain-3",
    caseStudyId: "helicopter-racing-league",
    difficulty: "Medium",
    multiSelect: false,
    stem: "For this question, refer to the Helicopter Racing League (HRL) case study. HRL wants to allow external television broadcast partners (who do not have Google accounts or Cloud Identity credentials) to download specific high-resolution race video files from a private Cloud Storage bucket for a 4-hour window after each race ends. How should you grant this access with minimal operational overhead?",
    options: [
      { id: "A", text: "Make the Cloud Storage bucket public (`allUsers` granted `roles/storage.objectViewer`) for 4 hours after each race and use Cloud Scheduler to revoke it." },
      { id: "B", text: "Generate Cloud Storage Signed URLs with a `GET` method and a 4-hour expiration time using a dedicated Service Account, and deliver the Signed URLs to the broadcast partners." },
      { id: "C", text: "Create an IAM Google Account for every broadcast partner employee and grant them `roles/storage.admin` on the project." },
      { id: "D", text: "Configure an Identity-Aware Proxy (IAP) TCP tunnel to the Cloud Storage bucket for unauthenticated users." }
    ],
    correctIds: ["B"],
    explanation: "**Cloud Storage Signed URLs** provide time-limited, cryptographically signed read (`GET`) or write (`PUT`) access to a specific object for users who do not have Google accounts. Once the 4-hour expiration passes, the URL automatically becomes invalid.",
    optionBreakdown: {
      A: "Incorrect. Making the entire bucket public to `allUsers` exposes all videos to the entire internet during that window.",
      B: "Correct. Signed URLs grant temporary, scoped access to specific objects without requiring the recipient to have a Google account.",
      C: "Incorrect. Violates least privilege (`storage.admin` is excessive) and creates heavy identity management toil for external third parties.",
      D: "Incorrect. IAP requires authenticated Google identities and does not sit directly in front of direct GCS API calls."
    }
  },

  // ================= CASE STUDY: MOUNTKIRK GAMES =================
  {
    id: "q-mk-1",
    domainId: "domain-1",
    caseStudyId: "mountkirk-games",
    difficulty: "Hard",
    multiSelect: false,
    stem: "For this question, refer to the Mountkirk Games case study. Mountkirk Games is designing the backend for their new global multiplayer game. In their previous game, a single-region MySQL database became a severe write bottleneck during viral player spikes. For the new game, they require a database for player profiles, inventory, and in-game financial transactions that supports relational SQL queries, ACID transactions, automatic horizontal write scaling across multiple global regions, and 99.999% availability. Which database should you select?",
    options: [
      { id: "A", text: "Cloud SQL for MySQL with High Availability enabled and 5 cross-region Read Replicas." },
      { id: "B", text: "Cloud Spanner with a multi-region instance configuration." },
      { id: "C", text: "Cloud Bigtable replicated across 4 global zones." },
      { id: "D", text: "BigQuery with partitioned and clustered tables." }
    ],
    correctIds: ["B"],
    explanation: "**Cloud Spanner** is the only Google Cloud database that combines a **relational SQL schema**, **ACID transactions with strong external consistency (TrueTime)**, **horizontal write scalability across multiple regions**, and a **99.999% multi-region SLA**. Read replicas in Cloud SQL only scale reads—all writes still bottleneck on a single regional primary VM.",
    optionBreakdown: {
      A: "Incorrect. Cloud SQL Read Replicas only scale read traffic; write throughput is still limited to a single regional primary instance (max 99.95% SLA).",
      B: "Correct. Cloud Spanner multi-region delivers 99.999% availability, global ACID transactions, ANSI SQL, and linear horizontal write scaling.",
      C: "Incorrect. Cloud Bigtable is a wide-column NoSQL store that does not support multi-row ACID relational transactions or SQL joins.",
      D: "Incorrect. BigQuery is an OLAP analytical warehouse with high latency (seconds), unsuitable for millisecond OLTP game transactions."
    }
  },
  {
    id: "q-mk-2",
    domainId: "domain-1",
    caseStudyId: "mountkirk-games",
    difficulty: "Hard",
    multiSelect: false,
    stem: "For this question, refer to the Mountkirk Games case study. Mountkirk's mobile game clients send gameplay telemetry events over cellular networks. Because players frequently enter tunnels or lose cellular coverage, telemetry events often arrive at Google Cloud 20 to 60 minutes after the action actually occurred on the player's phone. Game analysts need near real-time BigQuery dashboards that accurately aggregate metrics into 5-minute windows based on when the event occurred on the device. How should you design the ingestion pipeline?",
    options: [
      { id: "A", text: "Have mobile devices upload log files to Cloud Storage every hour and trigger a Cloud Run Job to load them into BigQuery sorted by arrival time." },
      { id: "B", text: "Stream events into Cloud Pub/Sub and process them with a Cloud Dataflow pipeline configured with event-time windowing, watermarks, and allowed lateness triggers before writing to BigQuery." },
      { id: "C", text: "Use a Pub/Sub BigQuery Subscription to write raw messages directly into BigQuery partitioned by ingestion time (`_PARTITIONTIME`)." },
      { id: "D", text: "Stream events into Cloud Bigtable and run a nightly Cloud Dataproc Spark batch job to re-sort the previous day's records." }
    ],
    correctIds: ["B"],
    explanation: "This is one of the most famous PCA exam questions! When mobile/IoT data arrives **late or out of order** due to intermittent connectivity, you must distinguish **Event Time** (when the event occurred on the phone) from **Processing Time** (when the cloud received it). **Cloud Pub/Sub + Cloud Dataflow (Apache Beam)** natively solves this using **Event-Time Windowing, Watermarks, and Allowed Lateness Triggers**.",
    optionBreakdown: {
      A: "Incorrect. Hourly batch file uploads caused data corruption and delays in Mountkirk's previous architecture and fail the near real-time requirement.",
      B: "Correct. Pub/Sub buffers incoming events while Dataflow's Apache Beam model uses event timestamps, watermarks, and triggers to accurately bucket late-arriving data.",
      C: "Incorrect. A direct Pub/Sub BigQuery Subscription does not perform stateful event-time windowed aggregations with watermarks for late data.",
      D: "Incorrect. Nightly batch jobs violate Mountkirk's business requirement for near real-time live game tuning."
    }
  },
  {
    id: "q-mk-3",
    domainId: "domain-4",
    caseStudyId: "mountkirk-games",
    difficulty: "Hard",
    multiSelect: false,
    stem: "For this question, refer to the Mountkirk Games case study. After migrating player transaction logs to Cloud Spanner, the engineering team notices high write latency and CPU utilization concentrated on a single Spanner split server during peak tournament hours, even though overall cluster CPU utilization is below 25%. You inspect the `player_transactions` table DDL and see: `PRIMARY KEY (transaction_timestamp, transaction_id)` where `transaction_id` is a sequential auto-incrementing integer. How should you resolve this bottleneck?",
    options: [
      { id: "A", text: "Double the number of Cloud Spanner processing units so the cluster has more total CPU capacity." },
      { id: "B", text: "Redesign the primary key to start with a high-cardinality non-monotonic value, such as a UUID v4 (`transaction_uuid`) or a hash prefix of `player_id`, instead of `transaction_timestamp`." },
      { id: "C", text: "Add a secondary index on `transaction_timestamp` in ascending order." },
      { id: "D", text: "Export the data from Cloud Spanner to Cloud SQL for PostgreSQL every 5 minutes." }
    ],
    correctIds: ["B"],
    explanation: "In both **Cloud Spanner** and **Cloud Bigtable**, starting a primary key (or secondary index key) with a **monotonically increasing timestamp or sequential integer** causes severe **hotspotting** because Spanner organizes rows lexicographically by key range—forcing 100% of new inserts onto the last split server. Adding more nodes will NOT fix a monotonic key hotspot! You must distribute writes across splits using a **UUID v4**, **hash shard prefix**, or **bit-reversed integer**.",
    optionBreakdown: {
      A: "Incorrect. Adding more nodes does not fix a monotonic timestamp hotspot because all new writes still target the single highest key-range split.",
      B: "Correct. Using a UUID v4 or hashed player_id prefix distributes inserts evenly across all Spanner splits and nodes.",
      C: "Incorrect. Creating a secondary index on a monotonically increasing timestamp creates the exact same hotspot on the index table!",
      D: "Incorrect. Moving to Cloud SQL worsens write scalability."
    }
  },

  // ================= CASE STUDY: TERRAMEARTH =================
  {
    id: "q-te-1",
    domainId: "domain-1",
    caseStudyId: "terramearth",
    difficulty: "Hard",
    multiSelect: false,
    stem: "For this question, refer to the TerramEarth case study. TerramEarth currently ingests real-time telemetry from 200,000 cellular-connected vehicles via Cloud Pub/Sub and batch gzipped CSV files from 19.8 million unconnected vehicles via Cloud Storage when they return to maintenance depots. Both datasets require identical data cleansing, unit normalization, and enrichment before loading into BigQuery. The engineering VP wants to avoid maintaining two separate codebases for streaming and batch ETL. What should you recommend?",
    options: [
      { id: "A", text: "Write the transformation logic once using the Apache Beam SDK and execute it on Cloud Dataflow for both the unbounded Pub/Sub stream and the bounded Cloud Storage batch files." },
      { id: "B", text: "Use Cloud Functions for the Pub/Sub stream and Cloud Dataproc Hive jobs for the Cloud Storage batch files." },
      { id: "C", text: "Have the maintenance depots replay the batch CSV files line-by-line over cellular modems into Pub/Sub." },
      { id: "D", text: "Load raw corrupted data directly into Cloud Spanner and run stored procedures every night." }
    ],
    correctIds: ["A"],
    explanation: "**Apache Beam** running on **Cloud Dataflow** provides a unified programming model for both **unbounded (streaming)** data sources like Cloud Pub/Sub and **bounded (batch)** data sources like Cloud Storage files. TerramEarth engineers can write and test their normalization transforms once and run them in both modes with zero duplicate logic.",
    optionBreakdown: {
      A: "Correct. Cloud Dataflow (Apache Beam) supports unified batch and stream processing from a single codebase.",
      B: "Incorrect. Requires maintaining two completely different codebases and runtimes (JavaScript/Python functions + Hive/Spark).",
      C: "Incorrect. Replaying multi-terabyte depot archives over cellular modems is slow, expensive, and unnecessary.",
      D: "Incorrect. Cloud Spanner is an OLTP database, not an ETL engine or analytical data warehouse."
    }
  },
  {
    id: "q-te-2",
    domainId: "domain-4",
    caseStudyId: "terramearth",
    difficulty: "Medium",
    multiSelect: false,
    stem: "For this question, refer to the TerramEarth case study. TerramEarth stores 500 TB of daily vehicle sensor telemetry in a single BigQuery table partitioned by `telemetry_date` (DAY). Dealership analysts run SQL queries that almost always filter on `telemetry_date` for the past 30 days and filter or aggregate by `vehicle_model` and `dealer_id`. However, TerramEarth must keep 5 years of data online in BigQuery for occasional multi-year trend queries while minimizing both storage and query costs. Which two actions should you take? (Choose two.)",
    options: [
      { id: "A", text: "Cluster the partitioned BigQuery table on `vehicle_model` and `dealer_id`, and enable `--require_partition_filter=true`." },
      { id: "B", text: "Avoid running `UPDATE`, `DELETE`, or `MERGE` DML statements on partitions older than 90 days so BigQuery automatically applies the 50% Long-Term Storage discount." },
      { id: "C", text: "Run a nightly cron job that exports BigQuery partitions older than 90 days to Cloud Storage Archive and deletes them from BigQuery." },
      { id: "D", text: "Create a separate BigQuery table for every single vehicle (20 million tables) to isolate queries." },
      { id: "E", text: "Instruct analysts to always use `SELECT *` so BigQuery caches the entire table in BI Engine." }
    ],
    correctIds: ["A", "B"],
    explanation: "1) **Clustering** the date-partitioned table by `vehicle_model` and `dealer_id` (plus enforcing `require_partition_filter`) dramatically reduces the bytes scanned per query. 2) BigQuery automatically lowers storage cost by **~50% (Long-Term Storage pricing)** for any table partition that has not been modified for **90 consecutive days**, while keeping the data 100% online and queryable at full speed!",
    optionBreakdown: {
      A: "Correct. Partitioning by date + clustering by high-cardinality filter columns (`vehicle_model`, `dealer_id`) + requiring partition filters optimizes query scan costs.",
      B: "Correct. Leaving partitions untouched for 90 days triggers automatic BigQuery Long-Term Storage pricing (~50% discount) with zero performance penalty.",
      C: "Incorrect. Deleting partitions older than 90 days breaks the requirement to keep 5 years of data online in BigQuery for multi-year SQL trend queries.",
      D: "Incorrect. Sharding into 20 million separate tables hits metadata limits and harms performance.",
      E: "Incorrect. `SELECT *` is the #1 BigQuery cost anti-pattern because columnar storage charges per column scanned."
    }
  },
  {
    id: "q-te-3",
    domainId: "domain-5",
    caseStudyId: "terramearth",
    difficulty: "Medium",
    multiSelect: false,
    stem: "For this question, refer to the TerramEarth case study. Remote agricultural dealerships across South America and Africa experience slow transfer speeds and frequent timeouts when uploading large 50 GB compressed maintenance archives to TerramEarth's central US Cloud Storage bucket over high-latency internet links. How should you optimize these uploads?",
    options: [
      { id: "A", text: "Configure the Cloud Storage bucket as a Multi-Region or Dual-Region bucket and instruct dealerships to use `gcloud storage cp` (or `gsutil -m`) with parallel composite uploads enabled." },
      { id: "B", text: "Deploy a Dedicated Interconnect to every agricultural dealership." },
      { id: "C", text: "Have dealerships email the 50 GB files as base64 attachments to an App Engine mail endpoint." },
      { id: "D", text: "Set up a single FTP VM in `us-central1` and increase its vCPU count from 4 to 64." }
    ],
    correctIds: ["A"],
    explanation: "Uploading directly to **Cloud Storage** using **Parallel Composite Uploads** (`gcloud storage cp` / `gsutil -m`) splits large files into chunks uploaded concurrently in parallel, routing through Google's nearest global Edge Point of Presence (PoP) onto Google's private backbone and automatically resuming failed chunks.",
    optionBreakdown: {
      A: "Correct. Parallel composite uploads split large files into concurrent streams and leverage Google's global edge ingestion network.",
      B: "Incorrect. Provisioning Dedicated Interconnect circuits to hundreds of small remote dealerships is financially and logistically impossible.",
      C: "Incorrect. Email/App Engine requests cannot handle 50 GB payloads.",
      D: "Incorrect. A central FTP VM in one region suffers from single-stream TCP latency over long distances and creates an operational bottleneck."
    }
  },

  // ================= DOMAIN 1: DESIGNING & PLANNING ARCHITECTURE =================
  {
    id: "q-d1-1",
    domainId: "domain-1",
    caseStudyId: null,
    difficulty: "Hard",
    multiSelect: false,
    stem: "A financial services company is migrating a mission-critical payment processing platform to Google Cloud. Business continuity regulations stipulate a Recovery Point Objective (RPO) of zero (0 seconds of data loss) and a Recovery Time Objective (RTO) of under 30 seconds, even if an entire Google Cloud region experiences a catastrophic outage. Which architecture satisfies both requirements?",
    options: [
      { id: "A", text: "Deploy the application on a Regional GKE cluster in `us-central1` backed by Cloud SQL for PostgreSQL with High Availability (HA) enabled and daily automated backups stored in a multi-region Cloud Storage bucket." },
      { id: "B", text: "Deploy the application on GKE clusters in both `us-central1` and `us-east1` behind a Global External Application Load Balancer, backed by a multi-region Cloud Spanner instance." },
      { id: "C", text: "Deploy the application on Cloud Run in `us-central1` backed by Cloud SQL in `us-central1` with an asynchronous Cross-Region Read Replica in `us-east1`." },
      { id: "D", text: "Keep the primary database in `us-central1`, take Persistent Disk snapshots every 10 minutes, and use Terraform to provision `us-east1` if `us-central1` fails." }
    ],
    correctIds: ["B"],
    explanation: "To survive a **full regional outage** with **RPO = 0 (zero data loss)** and **RTO < 30 seconds**, you need an **Active-Active Multi-Region Architecture**: 1) Compute running simultaneously in at least two regions behind a **Global External Application Load Balancer** (which automatically stops routing to an unhealthy region within seconds), and 2) **Cloud Spanner Multi-Region**, which synchronously replicates transactions across multiple regions with zero data loss (RPO = 0) and 99.999% availability.",
    optionBreakdown: {
      A: "Incorrect. Cloud SQL HA only protects against a single *zonal* failure within one region. If the entire `us-central1` region fails, the service goes down.",
      B: "Correct. Multi-region GKE/Cloud Run + Global ALB + Multi-region Cloud Spanner achieves RPO = 0 and near-instant automatic regional failover.",
      C: "Incorrect. Cloud SQL Cross-Region Read Replicas use *asynchronous* replication (meaning RPO > 0—unreplicated seconds of data can be lost) and require manual promotion (RTO in minutes).",
      D: "Incorrect. 10-minute snapshots yield an RPO of 10 minutes, and cold Terraform provisioning takes many minutes (violating RTO < 30s)."
    }
  },
  {
    id: "q-d1-2",
    domainId: "domain-1",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your company is modernizing a 15-year-old monolithic Java ERP application currently running on-premises. The monolith is brittle, tightly coupled, and takes 3 weeks to test before each release. The CTO wants to gradually replace specific modules (starting with the Customer Notification and Invoice PDF services) with cloud-native microservices on Google Cloud without rewriting the entire monolith at once or disrupting external API clients. Which architectural migration pattern should you implement?",
    options: [
      { id: "A", text: "The Strangler Fig pattern using Apigee or a Global Application Load Balancer with URL Maps to route migrated endpoints (`/api/notifications`, `/api/invoices`) to Cloud Run while forwarding legacy paths back to the monolith over Cloud Interconnect." },
      { id: "B", text: "Big-Bang Rewrite: Freeze all feature development on the monolith for 18 months while rewriting the entire ERP in Go on GKE." },
      { id: "C", text: "Database-First Shared Schema: Point the new Cloud Run microservices directly at the legacy on-premises Oracle tables using database triggers for synchronization." },
      { id: "D", text: "Deploy the monolith inside a single Docker container on Cloud Run Functions." }
    ],
    correctIds: ["A"],
    explanation: "The **Strangler Fig Pattern** places a routing facade (like **Apigee API Gateway** or a **Global Application Load Balancer URL Map**) in front of the legacy monolith. As individual bounded contexts (e.g., `/api/notifications`) are extracted into independent Cloud Run or GKE microservices, the proxy routes those specific paths to the new service while remaining traffic continues to hit the monolith seamlessly.",
    optionBreakdown: {
      A: "Correct. Strangler Fig with an API Gateway/Load Balancer facade enables incremental, low-risk microservice extraction.",
      B: "Incorrect. Big-bang rewrites carry extreme business risk and stall product delivery.",
      C: "Incorrect. Sharing the monolith's internal database schema across microservices maintains tight coupling and latency over hybrid links.",
      D: "Incorrect. A heavy, stateful 15-year-old Java monolith is unsuitable for Cloud Run Functions."
    }
  },
  {
    id: "q-d1-3",
    domainId: "domain-1",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "A genomics research institute runs thousands of GKE Pods that process DNA sequencing files. Every Pod across 50 worker nodes needs concurrent Read-Write (`ReadWriteMany`) POSIX file system access to the same shared 20 TB reference genome directory. Which storage service should you configure for the GKE PersistentVolume?",
    options: [
      { id: "A", text: "Compute Engine Zonal Balanced Persistent Disk (`pd-balanced`)." },
      { id: "B", text: "Filestore configured with the Filestore CSI driver in GKE." },
      { id: "C", text: "Local SSDs attached to each GKE node." },
      { id: "D", text: "Memorystore for Memcached." }
    ],
    correctIds: ["B"],
    explanation: "Whenever a scenario requires **concurrent `ReadWriteMany` (RWX) POSIX-compliant file system access across multiple GKE nodes or GCE VMs**, **Filestore** (managed NFS) is the primary solution. Standard Persistent Disks attached to multiple nodes only support `ReadOnlyMany` (ROX) or single-node `ReadWriteOnce` (RWO).",
    optionBreakdown: {
      A: "Incorrect. Persistent Disks in multi-attach mode only support `ReadOnlyMany` (ROX) across multiple nodes, not concurrent `ReadWriteMany` POSIX mounts.",
      B: "Correct. Filestore provides managed NFS shares supporting `ReadWriteMany` (RWX) POSIX mounts across thousands of Pods.",
      C: "Incorrect. Local SSDs are ephemeral and isolated to each individual host VM.",
      D: "Incorrect. Memorystore is an in-memory key-value cache, not a POSIX filesystem."
    }
  },
  {
    id: "q-d1-4",
    domainId: "domain-1",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your organization has 800 on-premises Microsoft Windows Server and SQL Server virtual machines with perpetual per-core licenses that include License Mobility, plus an additional 100 Windows Server licenses that are bound to physical hardware cores without License Mobility. You want to migrate these workloads to Google Cloud while complying with licensing terms and minimizing licensing costs. How should you provision the compute infrastructure?",
    options: [
      { id: "A", text: "Deploy the 100 physical-core-bound workloads onto Compute Engine Sole-Tenant Nodes using Bring Your Own License (BYOL) images, and deploy the 800 License Mobility workloads on standard multi-tenant Compute Engine VMs." },
      { id: "B", text: "Purchase new pay-as-you-go (PAYG) Windows and SQL Server licenses from Google Cloud for all 900 VMs on multi-tenant hosts." },
      { id: "C", text: "Run all 900 Windows Server VMs inside GKE Autopilot Linux containers." },
      { id: "D", text: "Deploy all 900 VMs on Spot VMs to offset the cost of buying new Microsoft licenses." }
    ],
    correctIds: ["A"],
    explanation: "Microsoft licenses bound to **physical cores/sockets** (or older versions without Software Assurance / License Mobility) require dedicated physical hardware—which in Google Cloud is provided by **Compute Engine Sole-Tenant Nodes** (with node affinity labels and in-place restart policies to minimize physical core reassignment). Licenses with **License Mobility** can run on standard multi-tenant GCE VMs.",
    optionBreakdown: {
      A: "Correct. Uses Sole-Tenant Nodes only for the 100 physical-bound BYOL licenses and multi-tenant VMs for License Mobility workloads.",
      B: "Incorrect. Discards existing perpetual licenses and doubles licensing costs unnecessarily.",
      C: "Incorrect. Full Windows Server VMs and SQL Server instances cannot run inside Linux containers.",
      D: "Incorrect. Spot VMs cannot run stateful production SQL Server databases reliably and do not satisfy physical core licensing rules."
    }
  },
  {
    id: "q-d1-5",
    domainId: "domain-1",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "An enterprise retailer is migrating a high-throughput Oracle database (12 TB) to Google Cloud. They want to move away from proprietary commercial database licenses to an open-source-compatible relational engine in Google Cloud. The workload requires 99.99% availability (inclusive of maintenance events), high-speed transactional OLTP processing, and real-time analytical reporting queries on the same operational dataset without impacting transactional latency. Which database should you recommend?",
    options: [
      { id: "A", text: "AlloyDB for PostgreSQL with a Regional Primary instance, Read Pool instances, and the AlloyDB Columnar Engine enabled." },
      { id: "B", text: "Cloud SQL for MySQL with a zonal primary instance." },
      { id: "C", text: "Firestore in Datastore mode." },
      { id: "D", text: "Cloud Bigtable." }
    ],
    correctIds: ["A"],
    explanation: "**AlloyDB for PostgreSQL** is Google's premier target for migrating enterprise Oracle workloads to PostgreSQL. It offers a **99.99% SLA (inclusive of maintenance)**, **4x faster OLTP performance** than standard PostgreSQL, and a built-in **Columnar Engine** that accelerates analytical/reporting queries up to **100x** (HTAP) on operational data.",
    optionBreakdown: {
      A: "Correct. AlloyDB provides 99.99% SLA, PostgreSQL compatibility for Oracle migrations (via DMS), and a built-in columnar engine for hybrid transactional/analytical workloads.",
      B: "Incorrect. Cloud SQL for MySQL offers a 99.95% HA SLA, lacks a columnar analytical engine, and is less aligned with Oracle PL/SQL migration paths than PostgreSQL.",
      C: "Incorrect. Firestore is a NoSQL document database, unsuitable for a relational Oracle ERP migration.",
      D: "Incorrect. Bigtable is a NoSQL wide-column database without SQL joins or relational ACID transactions."
    }
  },

  // ================= DOMAIN 2: MANAGING & PROVISIONING INFRASTRUCTURE =================
  {
    id: "q-d2-1",
    domainId: "domain-2",
    caseStudyId: null,
    difficulty: "Hard",
    multiSelect: false,
    stem: "Your company has three VPC networks: `vpc-a`, `vpc-b`, and `vpc-c`, all with non-overlapping RFC 1918 CIDR blocks. `vpc-a` is connected to `vpc-b` via VPC Network Peering. `vpc-b` is connected to `vpc-c` via VPC Network Peering, and `vpc-b` also terminates a Cloud VPN tunnel to your on-premises data center. Developers in `vpc-a` report that their VMs can ping VMs in `vpc-b`, but cannot reach VMs in `vpc-c` or any servers in the on-premises data center. Why is this happening, and what is the most scalable architectural fix within your single GCP Organization?",
    options: [
      { id: "A", text: "VPC Network Peering is non-transitive. Consolidate the architecture into a Shared VPC (Host Project containing the subnets and Cloud VPN, with Service Projects for the teams) or use Network Connectivity Center (NCC)." },
      { id: "B", text: "Enable 'Export Custom Routes' on `vpc-a`, which automatically enables full transitive routing across unlimited peered VPC hops." },
      { id: "C", text: "Add a firewall rule in `vpc-b` allowing `0.0.0.0/0` ingress on all ports." },
      { id: "D", text: "Enable Private Google Access on all subnets in `vpc-a`." }
    ],
    correctIds: ["A"],
    explanation: "**VPC Network Peering is strictly non-transitive**: only directly peered networks can communicate. Even with custom route export enabled (`--export-subnet-routes-with-public-ip` / `--export-custom-routes`), `vpc-a` cannot transit through `vpc-b` to reach `vpc-c` (a 2nd peering hop). Consolidating into a **Shared VPC** (or using **Network Connectivity Center** / **Private Service Connect**) solves multi-project and hybrid connectivity cleanly.",
    optionBreakdown: {
      A: "Correct. VPC Peering is non-transitive; Shared VPC (or NCC) provides centralized hybrid connectivity and seamless routing across service projects.",
      B: "Incorrect. 'Export Custom Routes' only shares routes with *direct* peers (1 hop); it never enables transitive peering across `vpc-a -> vpc-b -> vpc-c`.",
      C: "Incorrect. This is a routing limitation (non-transitive peering), not a firewall issue.",
      D: "Incorrect. Private Google Access is for reaching Google APIs (`*.googleapis.com`), not RFC 1918 VPC or on-prem IPs."
    }
  },
  {
    id: "q-d2-2",
    domainId: "domain-2",
    caseStudyId: null,
    difficulty: "Hard",
    multiSelect: false,
    stem: "Your company recently acquired a startup that already uses Google Cloud. Both your company's production VPC and the acquired startup's VPC use the exact same `10.10.0.0/16` subnet CIDR block. Re-IPing either environment would take months. However, applications in your VPC need to consume a private gRPC fraud-scoring microservice running in the startup's VPC immediately over Google's internal network. What should you configure?",
    options: [
      { id: "A", text: "Configure VPC Network Peering between the two VPCs and add static routes with higher priority." },
      { id: "B", text: "Expose the startup's microservice behind an Internal Load Balancer with a Private Service Connect (PSC) Service Attachment, and create a Private Service Connect Endpoint in your VPC." },
      { id: "C", text: "Attach both VPCs to the same Shared VPC Host Project." },
      { id: "D", text: "Expose the fraud-scoring microservice on an unauthenticated public HTTP IP address." }
    ],
    correctIds: ["B"],
    explanation: "**Private Service Connect (PSC)** is specifically designed for service-oriented networking across VPCs—even across different Organizations or **VPCs with overlapping IP address ranges (`10.10.0.0/16`)**! PSC performs internal NAT between the consumer's local PSC Endpoint IP and the producer's Service Attachment behind an Internal Load Balancer.",
    optionBreakdown: {
      A: "Incorrect. VPC Network Peering outright rejects peering creation if any subnet CIDRs overlap between the two VPCs.",
      B: "Correct. Private Service Connect (PSC) allows private consumption of services across VPCs with overlapping IP ranges without exposing traffic to the public internet.",
      C: "Incorrect. You cannot merge existing overlapping subnet CIDRs into a single Shared VPC.",
      D: "Incorrect. Violates security requirements by exposing sensitive internal fraud-scoring APIs over the public internet."
    }
  },
  {
    id: "q-d2-3",
    domainId: "domain-2",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "You have a fleet of private Compute Engine VMs in `us-central1` that have no external IP addresses. These VMs need to: (1) read and write files to a Cloud Storage bucket, and (2) download security patches from external canonical Ubuntu repositories on the public internet. How should you configure networking to meet both requirements securely while minimizing cost?",
    options: [
      { id: "A", text: "Enable Private Google Access on the subnet for Cloud Storage traffic, and configure a Cloud NAT gateway on a Cloud Router in `us-central1` for outbound internet patch downloads." },
      { id: "B", text: "Assign ephemeral external IP addresses to all VMs temporarily whenever they need to access Cloud Storage or Ubuntu repos." },
      { id: "C", text: "Route all Cloud Storage traffic through a third-party NAT instance VM to avoid enabling Private Google Access." },
      { id: "D", text: "Configure Identity-Aware Proxy (IAP) TCP forwarding for outbound apt-get requests." }
    ],
    correctIds: ["A"],
    explanation: "1) **Private Google Access (PGA)** enabled on the subnet allows private VMs to reach Google APIs (`storage.googleapis.com`) privately at **zero NAT processing cost**. 2) **Cloud NAT** provides managed, software-defined outbound NAT for reaching external internet repositories (Ubuntu patches) without giving the VMs public IPs or allowing unsolicited inbound connections.",
    optionBreakdown: {
      A: "Correct. Combines Private Google Access (free internal path to Google APIs) with Cloud NAT (managed outbound internet access for OS patches).",
      B: "Incorrect. Assigning external IPs exposes VMs to the internet and violates security best practices.",
      C: "Incorrect. Sending Cloud Storage traffic through a self-managed NAT VM wastes money and creates a bandwidth bottleneck when PGA is free.",
      D: "Incorrect. IAP TCP forwarding is for *inbound* administrative SSH/RDP access, not outbound internet egress."
    }
  },
  {
    id: "q-d2-4",
    domainId: "domain-2",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your DevOps team manages 40 Google Cloud projects using Terraform. Currently, an engineer runs `terraform apply` from their laptop using their personal `Organization Admin` credentials, and the Terraform state file (`terraform.tfstate`) is stored in a local Git repository. You need to redesign this workflow to follow Google Cloud security and reliability best practices. What should you do?",
    options: [
      { id: "A", text: "Store the remote Terraform state in a Cloud Storage bucket with Object Versioning enabled, and execute Terraform via Cloud Build (or GitHub Actions with Workload Identity Federation) using a least-privilege Service Account." },
      { id: "B", text: "Keep `terraform.tfstate` in Git, but encrypt the Git repository with a password shared among all developers." },
      { id: "C", text: "Download a Service Account JSON key with `roles/owner`, commit it to the Git repository, and run Terraform from a shared Compute Engine VM." },
      { id: "D", text: "Store the Terraform state file inside Cloud Memorystore for Redis." }
    ],
    correctIds: ["A"],
    explanation: "Google Cloud Terraform best practices mandate: 1) **Remote State in Cloud Storage** with **Object Versioning** (for state recovery) and automatic state locking; 2) **Never committing `.tfstate` to Git** (because state files often contain plaintext secrets/tokens and cause merge conflicts); and 3) Running `terraform plan/apply` through automated CI/CD (**Cloud Build** or **Workload Identity Federation**) using scoped Service Accounts.",
    optionBreakdown: {
      A: "Correct. Uses a versioned GCS bucket for remote locked state and automated CI/CD with keyless least-privilege Service Accounts.",
      B: "Incorrect. Storing `.tfstate` in Git risks state corruption from concurrent runs and exposes sensitive resource attributes in commit history.",
      C: "Incorrect. Committing a JSON key with `roles/owner` to Git is a critical security vulnerability.",
      D: "Incorrect. Memorystore is an ephemeral cache, not a durable backend for Terraform state."
    }
  },

  // ================= DOMAIN 3: DESIGNING FOR SECURITY & COMPLIANCE =================
  {
    id: "q-d3-1",
    domainId: "domain-3",
    caseStudyId: null,
    difficulty: "Hard",
    multiSelect: false,
    stem: "Your Chief Information Security Officer (CISO) is concerned about a data exfiltration threat scenario: an attacker compromises a developer's laptop or steals a valid OAuth token and uses it from an external network—or from inside a compromised VM—to run `bq extract` or `gcloud storage cp` and copy sensitive customer tables from your production project (`prod-data-proj`) into an external Google Cloud project's bucket owned by the attacker. IAM roles cannot prevent this because the compromised identity legitimately needs read access to `prod-data-proj`. Which Google Cloud security control prevents this exfiltration?",
    options: [
      { id: "A", text: "Place `prod-data-proj` inside a VPC Service Controls (VPC-SC) perimeter restricting BigQuery and Cloud Storage APIs, combined with Access Context Manager access levels." },
      { id: "B", text: "Create a VPC Firewall rule blocking egress on TCP port 443 to `0.0.0.0/0`." },
      { id: "C", text: "Enable Cloud Armor Adaptive Protection on the External Application Load Balancer." },
      { id: "D", text: "Enable Customer-Managed Encryption Keys (CMEK) on the BigQuery dataset." }
    ],
    correctIds: ["A"],
    explanation: "**VPC Service Controls (VPC-SC)** is the exact answer whenever a question describes **preventing data exfiltration from multi-tenant Google APIs (BigQuery, Cloud Storage, Spanner)** to unauthorized external projects/buckets, even when the attacker possesses valid IAM credentials! VPC-SC blocks data movement across perimeter boundaries unless explicitly permitted by Ingress/Egress rules.",
    optionBreakdown: {
      A: "Correct. VPC Service Controls create a logical security perimeter around BigQuery and Cloud Storage that blocks copying data to buckets/projects outside the perimeter.",
      B: "Incorrect. VPC Firewall rules only apply to Compute Engine VMs inside a VPC—they cannot stop someone calling `bigquery.googleapis.com` from outside the VPC or stop server-side GCS-to-GCS copies.",
      C: "Incorrect. Cloud Armor protects HTTP(S) Load Balancers from DDoS/WAF attacks, not BigQuery/GCS API data exfiltration.",
      D: "Incorrect. If an attacker has valid IAM read permissions on the dataset, BigQuery automatically decrypts CMEK data for their query."
    }
  },
  {
    id: "q-d3-2",
    domainId: "domain-3",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your company runs a CI/CD pipeline in GitHub Actions and several microservices in AWS EKS. Previously, engineers generated long-lived Google Cloud Service Account JSON keys and stored them in GitHub Secrets and AWS Secrets Manager so those workloads could push images to Artifact Registry and query BigQuery. Your security team has just enforced the Organization Policy `constraints/iam.disableServiceAccountKeyCreation`. How should you allow GitHub Actions and AWS EKS workloads to authenticate to Google Cloud APIs without JSON keys?",
    options: [
      { id: "A", text: "Configure Workload Identity Federation with an Workload Identity Pool and OIDC/AWS Provider, and configure the external workloads to exchange their native GitHub/AWS tokens for short-lived Google Cloud STS tokens via Service Account impersonation." },
      { id: "B", text: "Request an exception to the Organization Policy and rotate the JSON keys every 90 days using a bash script." },
      { id: "C", text: "Embed a human administrator's `gcloud auth login` refresh token inside the GitHub Actions workflow YAML." },
      { id: "D", text: "Make the Artifact Registry repository and BigQuery datasets public (`allUsers`) and filter by IP address." }
    ],
    correctIds: ["A"],
    explanation: "**Workload Identity Federation** is Google Cloud's keyless authentication mechanism for external workloads running in **AWS, Azure, GitHub Actions, GitLab CI, or on-premises Kubernetes/Active Directory**. It trusts external OIDC/SAML/AWS STS identity providers and exchanges their verifiable tokens for short-lived, 1-hour GCP OAuth access tokens—completely eliminating downloadable Service Account JSON keys!",
    optionBreakdown: {
      A: "Correct. Workload Identity Federation enables keyless authentication from AWS, Azure, and OIDC providers like GitHub Actions.",
      B: "Incorrect. Downloadable JSON keys are a high-risk credential leak vector that Workload Identity Federation replaces entirely.",
      C: "Incorrect. Using personal user credentials in automated CI/CD pipelines violates accountability and security policies.",
      D: "Incorrect. Exposing private registries and datasets to `allUsers` is a severe security breach."
    }
  },
  {
    id: "q-d3-3",
    domainId: "domain-3",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your operations team needs to troubleshoot Linux VMs via SSH in a production VPC. Security policy prohibits assigning external IP addresses to any VM, prohibits deploying or maintaining Bastion Host VMs, and requires that SSH access be governed by centralized IAM roles, Multi-Factor Authentication (MFA), and OS-level audit logging. What should you configure?",
    options: [
      { id: "A", text: "Enable OS Login (`enable-oslogin=TRUE`) on the project metadata, create a VPC firewall rule allowing TCP port 22 ingress from `35.235.240.0/20`, and grant authorized engineers `roles/iap.tunnelResourceAccessor` and `roles/compute.osLogin`." },
      { id: "B", text: "Create a Cloud NAT gateway and add a port-forwarding DNAT rule from the Cloud NAT IP to each VM on port 22." },
      { id: "C", text: "Generate an SSH key pair on a shared network drive and upload the public key to every VM's instance metadata manually." },
      { id: "D", text: "Open TCP port 22 from `0.0.0.0/0` and install `fail2ban` on each VM." }
    ],
    correctIds: ["A"],
    explanation: "**Identity-Aware Proxy (IAP) TCP Forwarding** combined with **Compute Engine OS Login** is the gold standard for zero-trust SSH/RDP access to private VMs. By allowing port 22 ingress only from Google's IAP proxy range (`35.235.240.0/20`), engineers run `gcloud compute ssh VM_NAME --tunnel-through-iap`, which verifies IAM roles (`roles/iap.tunnelResourceAccessor` + `roles/compute.osLogin`/`osAdminLogin`) and 2FA without needing public IPs or Bastion hosts.",
    optionBreakdown: {
      A: "Correct. IAP TCP Forwarding (`35.235.240.0/20`) + OS Login provides keyless, MFA-backed, IAM-governed SSH to private VMs with zero bastion hosts.",
      B: "Incorrect. Cloud NAT is strictly for outbound (egress) connections Initiated by private VMs; it does not support arbitrary inbound DNAT port forwarding.",
      C: "Incorrect. Shared static SSH keys in metadata lack individual auditability and cannot reach VMs without external IPs or VPN/IAP.",
      D: "Incorrect. VMs have no external IPs, and opening `0.0.0.0/0` violates the security policy."
    }
  },
  {
    id: "q-d3-4",
    domainId: "domain-3",
    caseStudyId: null,
    difficulty: "Hard",
    multiSelect: false,
    stem: "A European banking client must store sensitive financial records in Google Cloud (`europe-west3` Frankfurt). Their banking regulator mandates that the cryptographic encryption keys protecting their BigQuery tables and Cloud Storage buckets must remain physically stored inside the bank's existing on-premises hardware security appliance in Frankfurt, and must NEVER be stored at rest inside Google Cloud's infrastructure—while still allowing BigQuery SQL queries to function. Which encryption option should you configure?",
    options: [
      { id: "A", text: "Cloud External Key Manager (Cloud EKM) connected to the bank's on-premises key management partner over Private Service Connect / VPC." },
      { id: "B", text: "Customer-Supplied Encryption Keys (CSEK) passed in the HTTP header of every BigQuery SQL query." },
      { id: "C", text: "Customer-Managed Encryption Keys (CMEK) generated inside Google Cloud HSM in `europe-west3`." },
      { id: "D", text: "Google-Managed Default Encryption Keys (GMEK)." }
    ],
    correctIds: ["A"],
    explanation: "Notice two critical constraints in the prompt: 1) Keys must **never be stored inside Google Cloud** (ruling out standard Cloud KMS / Cloud HSM CMEK), and 2) It must work with **BigQuery** (BigQuery does NOT support CSEK, only CMEK and Cloud EKM!). **Cloud External Key Manager (Cloud EKM)** leaves keys inside an external on-premises/third-party key manager (Thales, Fortanix, etc.) and allows BigQuery and Cloud Storage to request wrap/unwrap operations over a secure URI.",
    optionBreakdown: {
      A: "Correct. Cloud EKM keeps encryption keys outside Google Cloud in an external key manager while supporting both BigQuery and Cloud Storage.",
      B: "Incorrect. BigQuery does NOT support Customer-Supplied Encryption Keys (CSEK); CSEK is only supported on Cloud Storage and Compute Engine Persistent Disks.",
      C: "Incorrect. Cloud HSM stores the keys inside Google Cloud's data centers, violating the regulator's mandate that keys stay in the bank's on-premises appliance.",
      D: "Incorrect. Default keys are stored and managed entirely by Google."
    }
  },
  {
    id: "q-d3-5",
    domainId: "domain-3",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: true,
    stem: "You are designing the Google Cloud Resource Hierarchy and IAM strategy for a large multinational enterprise with three divisions (Retail, Logistics, Finance), each having `dev`, `staging`, and `prod` environments. Which TWO practices align with Google Cloud's recommended security best practices? (Choose two.)",
    options: [
      { id: "A", text: "Assign IAM roles to Google Groups synchronized from corporate Active Directory (via GCDS) rather than granting IAM bindings to individual user email addresses." },
      { id: "B", text: "Use Folders for each division and environment (`Retail/Prod`, `Retail/Dev`), and apply Organization Policy constraints and Folder-level IAM bindings where shared inheritance is needed." },
      { id: "C", text: "Grant all developers the Basic `roles/editor` role at the Organization node and use Project-level IAM Allow policies to subtract permissions in `prod` projects." },
      { id: "D", text: "Put all divisions and environments (`dev`, `staging`, `prod`) inside a single shared Google Cloud Project and separate resources using naming prefixes." },
      { id: "E", text: "Use the default Compute Engine Service Account (`PROJECT_NUMBER-compute@developer.gserviceaccount.com`) with `roles/editor` for all production VMs." }
    ],
    correctIds: ["A", "B"],
    explanation: "1) Always manage human access through **Google Groups** synced from your corporate IdP so onboarding/offboarding happens entirely in Active Directory without touching GCP IAM policies. 2) Structure **Folders** by department and environment (`dev`, `staging`, `prod`) and isolate environments into **separate Projects** (since the Project is the fundamental trust and billing boundary). Note: IAM Allow policies are **additive (union)**—you cannot subtract an Organization-level `roles/editor` grant using a standard Project-level Allow policy!",
    optionBreakdown: {
      A: "Correct. Group-based IAM via GCDS/Cloud Identity ensures clean, auditable lifecycle management.",
      B: "Correct. Folders organize divisions/environments for clean policy inheritance, with separate Projects per environment.",
      C: "Incorrect. IAM Allow policies are strictly additive down the hierarchy; granting `roles/editor` at the Organization level gives everyone write access to `prod`.",
      D: "Incorrect. Mixing `dev` and `prod` in the same Project destroys blast-radius isolation and IAM trust boundaries.",
      E: "Incorrect. The default Compute Engine Service Account with `roles/editor` violates least privilege; always create dedicated user-managed Service Accounts per application."
    }
  },

  // ================= DOMAIN 4: ANALYZING & OPTIMIZING TECHNICAL & BUSINESS PROCESSES =================
  {
    id: "q-d4-1",
    domainId: "domain-4",
    caseStudyId: null,
    difficulty: "Hard",
    multiSelect: false,
    stem: "Your data engineering team runs a nightly Apache Spark ETL job on an on-premises Hadoop cluster that takes 2 hours to process 15 TB of clickstream logs stored in HDFS. During the remaining 22 hours of the day, the cluster sits idle. You are migrating this workload to Google Cloud with the goal of minimizing infrastructure costs and operational maintenance without rewriting the Spark code. What should you do?",
    options: [
      { id: "A", text: "Store the clickstream data in Cloud Storage (`gs://`), and use Cloud Composer (or Cloud Workflows) to spin up an ephemeral Cloud Dataproc cluster (or run Dataproc Serverless for Spark) with Spot VMs as secondary workers, deleting the cluster immediately after the 2-hour job finishes." },
      { id: "B", text: "Create a persistent 50-node Cloud Dataproc cluster running 24/7 with 20 TB of attached SSD Persistent Disks formatted as HDFS." },
      { id: "C", text: "Rewrite all Apache Spark jobs into C++ and run them on App Engine Standard." },
      { id: "D", text: "Run the Spark cluster entirely on 100% Spot VMs for both the Master node and Primary Worker nodes." }
    ],
    correctIds: ["A"],
    explanation: "The fundamental Dataproc optimization pattern on Google Cloud is **decoupling storage from compute**: 1) Replace HDFS with **Cloud Storage (`gs://`)** using the Cloud Storage connector; 2) Run **ephemeral job-scoped Dataproc clusters** (or **Dataproc Serverless**) so you only pay for compute during the 2 hours the job runs; and 3) Use **Spot VMs for secondary workers** (compute-only nodes without HDFS data) with Enhanced Flexibility Mode (EFM) for up to 91% compute savings.",
    optionBreakdown: {
      A: "Correct. Decouples storage into GCS, uses ephemeral clusters (or Dataproc Serverless) for 2 hours/day, and leverages Spot VMs for secondary workers.",
      B: "Incorrect. Paying 24/7 for a persistent HDFS cluster that is idle 22 hours a day wastes over 90% of compute spend.",
      C: "Incorrect. Violates the requirement to avoid rewriting the Spark code.",
      D: "Incorrect. Dataproc Master and Primary Worker nodes cannot be 100% Spot VMs because preemption of the master or primary HDFS/YARN state kills the entire job."
    }
  },
  {
    id: "q-d4-2",
    domainId: "domain-4",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your FinOps team analyzed your Google Cloud bill and found two consistent spending patterns across your Organization: (1) A baseline of 400 vCPUs and 1,600 GB RAM of N2 Compute Engine VMs in `us-central1` that run 24/7 for core databases and internal services, and (2) 200 vCPUs of Cloud Run, GKE Autopilot, and Compute Engine workloads that move between different regions (`us-central1`, `europe-west1`, `asia-east1`) and machine families every few months. How should you structure your Committed Use Discounts (CUDs) to maximize savings?",
    options: [
      { id: "A", text: "Purchase Hardware/Resource-Based CUDs for the steady 400 vCPUs of N2 VMs in `us-central1` (for the deepest discount up to 57–70%), and purchase Spend-Based Flexible CUDs for the variable multi-region/Cloud Run/GKE Autopilot usage." },
      { id: "B", text: "Convert all production databases and stateful workloads to Spot VMs." },
      { id: "C", text: "Rely solely on Sustained Use Discounts (SUDs) because N2 and E2 VMs automatically receive a 70% Sustained Use Discount." },
      { id: "D", text: "Purchase a single region-locked Resource-Based CUD in `us-central1` for all 600 vCPUs." }
    ],
    correctIds: ["A"],
    explanation: "Google Cloud offers two main types of Compute CUDs: 1) **Resource-Based CUDs** offer the highest discount (up to 57% for 3 years, or 70% on memory-optimized) but are tied to a specific **region and machine series** (ideal for predictable N2 baseline in `us-central1`). 2) **Flexible (Spend-Based) CUDs** apply across **any region, any GCE machine family, GKE Autopilot, and Cloud Run** based on $/hour commitment (up to 28–46% discount)—ideal for shifting multi-region/serverless workloads!",
    optionBreakdown: {
      A: "Correct. Combines deep Resource-Based CUDs for predictable regional N2 baseline with Flexible Spend-Based CUDs for portable Cloud Run/Autopilot/multi-region compute.",
      B: "Incorrect. Spot VMs can be preempted with 30 seconds notice and must never be used for stateful production databases.",
      C: "Incorrect. N2 Sustained Use Discounts max out at 20% (and E2 does not offer SUDs at all), far less than 1-year or 3-year CUDs.",
      D: "Incorrect. A Resource-Based CUD locked to `us-central1` N2 VMs will not cover Cloud Run, GKE Autopilot, or VMs running in `europe-west1`."
    }
  },
  {
    id: "q-d4-3",
    domainId: "domain-4",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your e-commerce application runs on GKE and uses Cloud SQL for PostgreSQL. During flash sales, hundreds of GKE Pods scale up within seconds and attempt to open thousands of concurrent database connections, exhausting `max_connections` on Cloud SQL and causing `FATAL: remaining connection slots are reserved` errors. Additionally, 85% of the queries are repetitive reads for the same top 500 product catalog items. Which two changes should you implement? (Choose two.)",
    options: [
      { id: "A", text: "Deploy Memorystore for Redis in front of Cloud SQL using a cache-aside pattern to serve repetitive product catalog reads from memory." },
      { id: "B", text: "Implement connection pooling (such as PgBouncer or application-level HikariCP/SQLAlchemy pools alongside Cloud SQL Auth Proxy) to multiplex Pod connections." },
      { id: "C", text: "Replace Cloud SQL with BigQuery so pods can run transactional cart updates against BigQuery." },
      { id: "D", text: "Disable High Availability (HA) on Cloud SQL to double the number of available connections." },
      { id: "E", text: "Increase the GKE Pod liveness probe frequency to query `SELECT * FROM products` every 1 second." }
    ],
    correctIds: ["A", "B"],
    explanation: "1) **Memorystore for Redis** (cache-aside pattern) absorbs the 85% repetitive read traffic for hot product catalog items at sub-millisecond latency. 2) **Connection Pooling (e.g., PgBouncer)** prevents serverless/container scale-out events from exhausting PostgreSQL's expensive per-connection process overhead (`max_connections`).",
    optionBreakdown: {
      A: "Correct. Memorystore for Redis offloads repetitive catalog reads from Cloud SQL.",
      B: "Correct. Connection pooling multiplexes thousands of ephemeral container connections into a controlled pool of persistent DB connections.",
      C: "Incorrect. BigQuery is an analytical warehouse, not an OLTP shopping cart database.",
      D: "Incorrect. Disabling HA reduces availability and has zero impact on `max_connections`.",
      E: "Incorrect. Querying the database in a 1-second liveness probe across hundreds of pods will worsen connection exhaustion and cause cascading outages."
    }
  },
  {
    id: "q-d4-4",
    domainId: "domain-4",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your company wants to ensure that no container image can be deployed to production GKE clusters or Cloud Run services unless it was built by your trusted Cloud Build pipeline, passed Artifact Analysis vulnerability scanning with zero 'CRITICAL' CVEs, and was cryptographically signed by your security team's QA stage. Which combination of services enforces this requirement?",
    options: [
      { id: "A", text: "Artifact Registry + Artifact Analysis + Binary Authorization (configured with an Attestor backed by Cloud KMS asymmetric keys)." },
      { id: "B", text: "Container Registry + Cloud Armor + Identity-Aware Proxy." },
      { id: "C", text: "VPC Service Controls + Cloud NAT." },
      { id: "D", text: "Shielded VMs with vTPM and Integrity Monitoring." }
    ],
    correctIds: ["A"],
    explanation: "**Binary Authorization** is a deploy-time admission control service for GKE and Cloud Run. During CI/CD, **Cloud Build** builds the image in **Artifact Registry**, **Artifact Analysis** scans for CVEs, and a Cloud KMS key signs a cryptographic **Attestation**. At deployment time, Binary Authorization blocks any image lacking the required attestation.",
    optionBreakdown: {
      A: "Correct. Binary Authorization verifies cryptographic attestations signed via Cloud KMS before allowing pods/revisions to start.",
      B: "Incorrect. Cloud Armor and IAP protect network/HTTP ingress at runtime; they do not enforce container image supply-chain attestations at deploy time.",
      C: "Incorrect. VPC-SC and Cloud NAT are network controls unrelated to container image verification.",
      D: "Incorrect. Shielded VMs verify the host VM boot loader/kernel, not container image CI/CD attestations."
    }
  },

  // ================= DOMAIN 5: MANAGING IMPLEMENTATION =================
  {
    id: "q-d5-1",
    domainId: "domain-5",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your mobile engineering team is releasing version 2.0 of their checkout API on Cloud Run. Because the new version introduces a refactored payment gateway integration, the Product Manager wants to test `v2.0` in production by routing only 5% of live user traffic to `v2.0` while 95% continues using `v1.0`. If error rates remain below 0.1% after 2 hours, traffic should gradually shift to 100%, with the ability to roll back to `v1.0` instantaneously without rebuilding the container. Which deployment strategy and feature should you use?",
    options: [
      { id: "A", text: "Canary deployment using Cloud Run native revision traffic splitting (`gcloud run services update-traffic --to-revisions=v2=5,v1=95`) or Cloud Deploy canary automation." },
      { id: "B", text: "Recreate deployment: Delete the Cloud Run service and redeploy `v2.0` from scratch." },
      { id: "C", text: "Create two separate Google Cloud projects and ask mobile users to manually change the API URL in their app settings." },
      { id: "D", text: "Deploy `v2.0` on a separate Compute Engine VM and use DNS round-robin with a 24-hour TTL." }
    ],
    correctIds: ["A"],
    explanation: "Testing a new release on a small subset (5%) of live production traffic before full rollout is a **Canary Deployment**. **Cloud Run** (and **Cloud Deploy**) natively supports percentage-based **revision traffic splitting** and instant zero-build rollback by shifting 100% of traffic back to the already-deployed `v1` revision.",
    optionBreakdown: {
      A: "Correct. Cloud Run native revision traffic splitting enables precise 5%/95% canary rollouts and instant rollback without rebuilding.",
      B: "Incorrect. Recreate causes downtime and exposes 100% of users to `v2.0` immediately.",
      C: "Incorrect. Asking users to manually change backend URLs is impractical and breaks seamless traffic management.",
      D: "Incorrect. DNS round-robin with a 24-hour TTL cannot enforce a 5%/95% split or provide instant rollback due to client DNS caching."
    }
  },
  {
    id: "q-d5-2",
    domainId: "domain-5",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your company runs a stateless web application on a Regional Managed Instance Group (MIG) behind a Global External Application Load Balancer. You need to deploy a new OS image and application version that has a strictly incompatible database response format during the cutover, meaning v1 and v2 instances must NEVER serve external user traffic at the exact same time—yet you require zero downtime during the switch and an instant fallback if v2 fails smoke tests. Which deployment pattern should you implement?",
    options: [
      { id: "A", text: "Blue/Green deployment: Provision a second MIG ('Green') running v2, validate it via internal smoke tests, and update the Load Balancer's backend service / URL map to switch 100% of traffic from the 'Blue' MIG to the 'Green' MIG atomically." },
      { id: "B", text: "Rolling update on the single MIG with `max-surge=1` and `max-unavailable=1` over 60 minutes." },
      { id: "C", text: "Canary deployment routing 10% of traffic to v2 for 3 days while 90% hits v1." },
      { id: "D", text: "Stop all VMs in the MIG, apply the update via SSH, and start them back up." }
    ],
    correctIds: ["A"],
    explanation: "When the prompt specifies that **v1 and v2 cannot serve user traffic simultaneously** AND requires **zero downtime with instant rollback**, both Rolling Updates and Canary deployments are disqualified (since both run v1 and v2 concurrently). A **Blue/Green Deployment** runs two complete environments (Blue = v1, Green = v2) and switches the Load Balancer backend atomically.",
    optionBreakdown: {
      A: "Correct. Blue/Green deployment prevents v1 and v2 from serving traffic concurrently while providing zero-downtime cutover and instant rollback.",
      B: "Incorrect. During a 60-minute rolling update, both v1 and v2 instances serve live user traffic simultaneously.",
      C: "Incorrect. A canary deployment serves v1 and v2 simultaneously.",
      D: "Incorrect. Stopping all VMs causes a complete production outage."
    }
  },
  {
    id: "q-d5-3",
    domainId: "domain-5",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "A developer on your team is writing a Python microservice that will run on GKE and needs to retrieve a third-party Stripe API secret stored in Google Cloud Secret Manager. Following security and reliability best practices, how should the application manage and access this secret?",
    options: [
      { id: "A", text: "Configure Workload Identity on GKE, grant `roles/secretmanager.secretAccessor` to the specific secret for the bound Service Account, and pin the production code to a specific immutable Secret Version (e.g., `versions/3`) rather than hardcoding secrets in the Dockerfile." },
      { id: "B", text: "Hardcode the Stripe API key as an `ENV` instruction inside the `Dockerfile` and push it to Artifact Registry." },
      { id: "C", text: "Store the Stripe API key in a plaintext `config.json` file inside the public GitHub repository." },
      { id: "D", text: "Grant `roles/owner` to the GKE node pool's default service account so all pods can read all secrets." }
    ],
    correctIds: ["A"],
    explanation: "Google Cloud Secret Manager best practices dictate: 1) Authenticate via **Workload Identity**; 2) Grant **`roles/secretmanager.secretAccessor` on the specific secret** (not project-wide); and 3) Reference a **specific version number** (or controlled alias) in production deployments rather than `latest` so an accidental secret edit doesn't immediately break production without a tested rollout.",
    optionBreakdown: {
      A: "Correct. Uses Workload Identity, least-privilege secret-level IAM, and pinned secret versions.",
      B: "Incorrect. Baking secrets into Docker image layers exposes them to anyone who pulls or inspects the image.",
      C: "Incorrect. Never commit secrets to version control.",
      D: "Incorrect. Violates least privilege across the entire node pool."
    }
  },

  // ================= DOMAIN 6: ENSURING SOLUTION & OPERATIONS RELIABILITY =================
  {
    id: "q-d6-1",
    domainId: "domain-6",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your SRE and Product teams have agreed on a Service Level Objective (SLO) of 99.9% successful HTTP requests (non-5xx) over a rolling 30-day window for the core Order Service, which translates to an Error Budget of 43.2 minutes per 30 days. Due to two flawed database migrations this month, the service experienced 55 minutes of 5xx errors, completely exhausting the 30-day Error Budget. Meanwhile, the Product team wants to launch three major new promotional features tomorrow. According to Google SRE best practices, what should happen next?",
    options: [
      { id: "A", text: "Halt all new feature releases (except critical security patches and reliability fixes) for the Order Service until the rolling 30-day Error Budget recovers, and prioritize engineering work on automated migration testing and rollback reliability." },
      { id: "B", text: "Lower the SLO from 99.9% to 95.0% immediately so the team can launch the promotional features on schedule." },
      { id: "C", text: "Fire the engineer who ran the database migration script to deter future mistakes." },
      { id: "D", text: "Delete the Cloud Monitoring metrics from the past two weeks to reset the Error Budget counter." }
    ],
    correctIds: ["A"],
    explanation: "Under Google's **Site Reliability Engineering (SRE)** model, the **Error Budget** (`1 - SLO`) is the objective control mechanism balancing innovation velocity against stability. When the Error Budget is **exhausted**, feature launches freeze and engineering resources are redirected to fixing architectural fragility, automating tests, and conducting a **blameless postmortem**.",
    optionBreakdown: {
      A: "Correct. Exhausting the error budget triggers a feature freeze until reliability is restored within the rolling SLO window.",
      B: "Incorrect. Arbitrarily lowering the SLO every time it is breached defeats the entire purpose of SLO governance.",
      C: "Incorrect. Violates Google SRE's core tenet of **Blameless Postmortems** (which focus on systemic causes rather than blaming individuals).",
      D: "Incorrect. Tampering with observability metrics hides risk from stakeholders."
    }
  },
  {
    id: "q-d6-2",
    domainId: "domain-6",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your Go-based recommendation microservice running on GKE has experienced a 40% increase in compute costs over the last two weeks because Horizontal Pod Autoscaler (HPA) keeps scaling up Pods due to high CPU utilization and occasional Out-Of-Memory (OOM) kills. However, end-to-end request latency in Cloud Trace looks normal. You need to identify the exact Go function and line of code causing the excessive CPU and heap memory consumption in production with minimal (<1%) performance overhead. Which tool should you use?",
    options: [
      { id: "A", text: "Cloud Profiler" },
      { id: "B", text: "Cloud Trace" },
      { id: "C", text: "VPC Flow Logs" },
      { id: "D", text: "Cloud Audit Logs" }
    ],
    correctIds: ["A"],
    explanation: "**Cloud Profiler** uses low-overhead statistical sampling (<1% overhead, safe for continuous production use) to generate flame graphs showing **which exact functions/methods inside your code are consuming CPU time and heap memory**. (**Cloud Trace**, by contrast, measures latency between distributed RPC/HTTP calls across services).",
    optionBreakdown: {
      A: "Correct. Cloud Profiler pinpoints function-level CPU and memory consumption inside production application code.",
      B: "Incorrect. Cloud Trace tracks distributed request latency across services, not function-level CPU/memory heap profiles.",
      C: "Incorrect. VPC Flow Logs capture network packet metadata at the VM NIC level.",
      D: "Incorrect. Cloud Audit Logs record GCP API administrative and data access events."
    }
  },
  {
    id: "q-d6-3",
    domainId: "domain-6",
    caseStudyId: null,
    difficulty: "Hard",
    multiSelect: false,
    stem: "Your security and compliance team manages an Organization with 6 folders and 120 Google Cloud projects. They have three requirements for Cloud Logging: (1) Automatically collect all Cloud Audit Logs from all current and future projects into a central Security project and stream them in real time to an external Splunk SIEM; (2) Retain a copy of all audit logs for 7 years at the lowest possible storage cost for regulatory audits; and (3) Stop paying Cloud Logging ingestion fees for verbose `DEBUG` application logs emitted by GKE containers in the `dev` folder. How should you configure the Log Router?",
    options: [
      { id: "A", text: "Create an Organization-level Aggregated Sink (`--include-children`) routing audit logs to a Pub/Sub topic (for Splunk) and a second Aggregated Sink to a Cloud Storage Archive bucket with a 7-year Retention Policy; and configure an Exclusion Filter on the `_Default` sink in the `dev` folder for `severity=DEBUG`." },
      { id: "B", text: "Manually create 120 separate project-level sinks to BigQuery and run a daily `DELETE` query for `DEBUG` logs." },
      { id: "C", text: "Keep all logs in the `_Default` Cloud Logging bucket for 7 years and export them to Splunk via email alerts." },
      { id: "D", text: "Disable Cloud Logging API across the `dev` folder entirely." }
    ],
    correctIds: ["A"],
    explanation: "This question tests the complete **Cloud Logging Log Router** architecture: 1) **Aggregated Sinks** at the Organization level with `--include-children` capture logs from all current and future child projects automatically; 2) **Pub/Sub** is the standard sink destination for streaming logs to external SIEMs like Splunk; 3) **Cloud Storage Archive** (with a Retention Policy/Bucket Lock) is the cheapest destination for 7-year cold compliance retention; and 4) **Exclusion Filters** on the `_Default` sink drop `DEBUG` logs *before* ingestion so you pay $0 in ingestion/storage charges!",
    optionBreakdown: {
      A: "Correct. Uses Org-level Aggregated Sinks to Pub/Sub (SIEM) and GCS Archive (7-year low-cost retention), plus an Exclusion Filter to avoid `DEBUG` ingestion charges.",
      B: "Incorrect. Deleting logs after they are ingested into BigQuery or Cloud Logging still incurs full ingestion charges, and BigQuery storage is more expensive than GCS Archive for 7-year untouched archives.",
      C: "Incorrect. Retaining all logs in Cloud Logging buckets for 7 years is much more expensive than GCS Archive, and email alerts cannot stream logs to a SIEM.",
      D: "Incorrect. Disabling the Logging API entirely blinds developers to `ERROR` and `CRITICAL` logs in `dev`."
    }
  },
  {
    id: "q-d6-4",
    domainId: "domain-6",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your application runs on a Regional Managed Instance Group (MIG) with an autohealing health check polling `/healthz` every 5 seconds. Currently, the `/healthz` handler executes a test query against the shared backend Cloud SQL database and calls an external third-party shipping rate API. Yesterday, the third-party shipping API experienced a 15-second latency spike, which caused the MIG autohealer to mark all 40 VMs unhealthy and recreate them simultaneously—taking down your entire site for 10 minutes. How should you fix the health check design?",
    options: [
      { id: "A", text: "Modify the MIG autohealing health check (`/healthz`) to verify only local VM process and web-server health without blocking on external/shared downstream dependencies, and handle transient third-party API failures gracefully using circuit breakers and exponential backoff." },
      { id: "B", text: "Decrease the health check interval from 5 seconds to 1 second and set the unhealthy threshold to 1." },
      { id: "C", text: "Disable health checks on both the Load Balancer and the MIG permanently." },
      { id: "D", text: "Configure the `/healthz` endpoint to reboot the Cloud SQL instance whenever the third-party API times out." }
    ],
    correctIds: ["A"],
    explanation: "Checking shared downstream dependencies (like a database or external API) inside an **autohealing/liveness probe** is a classic architectural anti-pattern. If the shared dependency hiccups, every VM fails its liveness check at once and gets killed/recreated by the MIG—causing a **cascading outage and thundering herd** on startup. Autohealing checks should only verify whether tearing down and recreating *this specific VM* will fix a local lockup.",
    optionBreakdown: {
      A: "Correct. Decouples VM autohealing liveness checks from external/shared downstream dependencies and uses circuit breakers for external APIs.",
      B: "Incorrect. Making the health check more aggressive (1s interval, threshold 1) will trigger mass VM recreation even faster during brief network jitter.",
      C: "Incorrect. Disabling health checks prevents the Load Balancer and MIG from detecting genuinely crashed VM processes.",
      D: "Incorrect. Rebooting the database during a third-party API outage destroys availability."
    }
  },
  {
    id: "q-d2-5",
    domainId: "domain-2",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your enterprise uses a Shared VPC architecture. Project `net-host-prod` is the Shared VPC Host Project managed by the Network Security team, and Project `app-checkout-prod` is a Service Project managed by the Checkout Application team. The Checkout team needs to deploy GKE clusters and Compute Engine VMs in `app-checkout-prod` using only the `us-central1-checkout-subnet` located in `net-host-prod`, without having permission to modify firewall rules or use other subnets in `net-host-prod`. Which IAM binding follows the principle of least privilege?",
    options: [
      { id: "A", text: "Grant `roles/compute.networkUser` to the Checkout team's group and the GKE/Compute Engine service accounts specifically at the `us-central1-checkout-subnet` resource level inside `net-host-prod`." },
      { id: "B", text: "Grant `roles/compute.networkAdmin` to the Checkout team at the `net-host-prod` project level." },
      { id: "C", text: "Grant `roles/compute.xpnAdmin` (Shared VPC Admin) to every developer in the Checkout team." },
      { id: "D", text: "Grant `roles/owner` on `net-host-prod` to the `app-checkout-prod` default service account." }
    ],
    correctIds: ["A"],
    explanation: "In a **Shared VPC**, you can grant **`roles/compute.networkUser` at the individual Subnet level** in the Host Project! This allows a Service Project's developers and GKE/Compute service accounts to launch resources into *only* that designated subnet (`us-central1-checkout-subnet`) without accessing other subnets or modifying VPC routes/firewalls.",
    optionBreakdown: {
      A: "Correct. Subnet-level `roles/compute.networkUser` enforces strict least-privilege isolation within a Shared VPC.",
      B: "Incorrect. `roles/compute.networkAdmin` at the project level allows modifying routes, subnets, and all network resources across the entire Host Project.",
      C: "Incorrect. Shared VPC Admin (`compute.xpnAdmin`) is an administrative role for attaching/detaching host and service projects.",
      D: "Incorrect. Granting `roles/owner` on the Host Project breaks the entire separation-of-duties model of Shared VPC."
    }
  },
  {
    id: "q-d3-6",
    domainId: "domain-3",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your public-facing e-commerce web application runs behind a Global External Application Load Balancer. Over the past 48 hours, your security operations center detected a Layer 7 Distributed Denial of Service (DDoS) attack and SQL Injection (SQLi) attempts originating from a specific botnet user-agent and two countries where your company does not do business. You need to block this malicious traffic at Google's network edge before it reaches your backend GKE pods or incurs compute autoscaling costs. What should you configure?",
    options: [
      { id: "A", text: "Attach a Google Cloud Armor security policy to the Load Balancer's backend service with preconfigured WAF rules (`sqli-v33-stable`), geo-based access control rules, custom header/user-agent filtering, and Adaptive Protection." },
      { id: "B", text: "Configure VPC Firewall rules on the GKE worker nodes to inspect HTTP headers and SQL strings." },
      { id: "C", text: "Enable Identity-Aware Proxy (IAP) on the public e-commerce storefront so anonymous shoppers must log in with a corporate Google Workspace account." },
      { id: "D", text: "Switch from the Global Application Load Balancer to a Regional Passthrough Network Load Balancer." }
    ],
    correctIds: ["A"],
    explanation: "**Google Cloud Armor** operates at Google's global edge alongside the Global External Application Load Balancer. It mitigates volumetric and Layer 7 DDoS attacks, blocks OWASP Top 10 threats (SQLi, XSS, LFI) via preconfigured WAF rule sets, filters by geo-location (`origin.region_code`) or HTTP headers, and uses ML-powered **Adaptive Protection** to detect anomalous traffic spikes.",
    optionBreakdown: {
      A: "Correct. Cloud Armor blocks L7 DDoS, SQLi, geo-regions, and malicious user-agents at the global edge before traffic hits backend compute.",
      B: "Incorrect. VPC Firewall rules operate at Layer 3/4 (IP and port) and cannot inspect Layer 7 HTTP headers, country codes, or SQL injection payloads.",
      C: "Incorrect. IAP is for authenticating known employees/partners; enabling it on a public storefront blocks anonymous shoppers.",
      D: "Incorrect. Passthrough NLBs route malicious packets directly to backend VMs."
    }
  },
  {
    id: "q-d1-6",
    domainId: "domain-1",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "You are designing the Cloud Bigtable row key schema for a smart-grid utility company that collects power consumption readings every second from 10 million smart meters (`meter_id`) across 50 geographic cities (`city_code`). The operations dashboard most frequently queries the most recent 1 hour of readings for a single specific `meter_id`. Which row key design avoids write hotspotting while making the dashboard's primary query a fast sequential range scan?",
    options: [
      { id: "A", text: "`meter_id#reverse_timestamp` (where `reverse_timestamp = MAX_LONG - epoch_timestamp`)" },
      { id: "B", text: "`timestamp#meter_id`" },
      { id: "C", text: "`city_code#timestamp`" },
      { id: "D", text: "`random_uuid#meter_id#timestamp`" }
    ],
    correctIds: ["A"],
    explanation: "In **Cloud Bigtable**: 1) Prefixing with high-cardinality **`meter_id`** distributes writes evenly across all tablet nodes (avoiding hotspotting). 2) Appending **`reverse_timestamp`** sorts the newest readings for a given `meter_id` at the top of that meter's key range, allowing the dashboard to fetch the latest 1 hour of readings for a specific meter with a single fast sequential prefix scan!",
    optionBreakdown: {
      A: "Correct. `meter_id#reverse_timestamp` distributes writes across 10M meters while clustering each meter's newest readings together for fast range scans.",
      B: "Incorrect. Starting the row key with `timestamp` causes severe write hotspotting on a single Bigtable node because all 10M meters write to the current second's timestamp simultaneously.",
      C: "Incorrect. Only 50 `city_code` values is low cardinality and does not allow querying a single `meter_id` efficiently.",
      D: "Incorrect. Starting with a `random_uuid` spreads a single meter's readings randomly across the entire table, forcing a full-table scan to retrieve 1 hour of data for one meter."
    }
  },
  {
    id: "q-d2-6",
    domainId: "domain-2",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "You need to migrate a 4 TB on-premises PostgreSQL 14 database to Cloud SQL for PostgreSQL. The business requires minimal downtime (less than 10 minutes) during the final production cutover. Which migration tool and strategy should you use?",
    options: [
      { id: "A", text: "Use Google Cloud Database Migration Service (DMS) with a continuous Change Data Capture (CDC) migration job over Cloud VPN/Interconnect, and promote the Cloud SQL destination instance during the brief cutover window." },
      { id: "B", text: "Stop the on-premises application, run `pg_dump` over the internet, upload the 4 TB file to Cloud Storage, and run `pg_restore` into Cloud SQL." },
      { id: "C", text: "Use Migrate to Virtual Machines to convert the PostgreSQL server into a GKE Autopilot Pod." },
      { id: "D", text: "Use BigQuery Data Transfer Service to replicate the PostgreSQL database into Cloud SQL." }
    ],
    correctIds: ["A"],
    explanation: "**Database Migration Service (DMS)** is Google Cloud's serverless, purpose-built tool for homogeneous and heterogeneous database migrations to Cloud SQL and AlloyDB. Using **continuous Change Data Capture (CDC)**, DMS performs an initial snapshot load and continuously streams ongoing transactions (`pglogical`) until the target is in sync—allowing a final cutover promotion in just a few minutes.",
    optionBreakdown: {
      A: "Correct. DMS continuous CDC replication keeps the Cloud SQL replica continuously synced so cutover downtime is under a few minutes.",
      B: "Incorrect. Dumping and restoring 4 TB offline takes many hours of complete database downtime.",
      C: "Incorrect. Migrate to VMs migrates VMs to Compute Engine (not managed Cloud SQL).",
      D: "Incorrect. BigQuery DTS loads analytical data into BigQuery, not Cloud SQL."
    }
  },
  {
    id: "q-d4-5",
    domainId: "domain-4",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your company runs a real-time bidding service on Cloud Run. Each container instance is stateless, I/O-bound (waiting on downstream HTTP API calls), and thread-safe. Currently, `concurrency` is set to `1` and `min-instances` is set to `0`. Users complain of 2-second latency spikes when traffic surges at the start of each hour, and your Cloud Run bill is higher than expected because hundreds of container instances spin up. Which two adjustments will reduce both cold-start latency and compute cost? (Choose two.)",
    options: [
      { id: "A", text: "Increase the Cloud Run container `concurrency` setting (e.g., to 80 or higher) so a single container instance handles multiple concurrent I/O-bound requests." },
      { id: "B", text: "Configure `min-instances` (minimum instances) > 0 to keep warm container instances ready to absorb sudden traffic spikes without cold starts." },
      { id: "C", text: "Set `max-instances` to `1` so no new containers ever spin up." },
      { id: "D", text: "Mount a 10 TB Persistent Disk to the Cloud Run container to cache the operating system." },
      { id: "E", text: "Move the stateless HTTP service to Cloud Dataproc." }
    ],
    correctIds: ["A", "B"],
    explanation: "1) When a Cloud Run service is **I/O-bound and thread-safe**, setting `concurrency=1` wastes CPU while waiting on network I/O and forces Cloud Run to spin up 1 container per simultaneous request. Increasing **concurrency (default 80, up to 1000)** dramatically reduces instance count, cold starts, and cost! 2) Setting **`min-instances`** keeps warm instances pre-initialized to eliminate cold-start spikes.",
    optionBreakdown: {
      A: "Correct. Higher concurrency allows each container to multiplex concurrent I/O-bound requests, slashing instance count and cold starts.",
      B: "Correct. `min-instances` maintains warm instances to absorb initial traffic surges with zero cold-start penalty.",
      C: "Incorrect. Capping `max-instances=1` with `concurrency=1` will cause immediate HTTP 429 errors under load.",
      D: "Incorrect. Cloud Run does not use Persistent Disks to avoid cold starts.",
      E: "Incorrect. Dataproc is for Apache Spark/Hadoop batch/stream processing, not low-latency HTTP bidding APIs."
    }
  },
  {
    id: "q-d5-4",
    domainId: "domain-5",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your application processes uploaded customer PDF invoices. When a PDF is uploaded to a Cloud Storage bucket, the system needs to sequentially: (1) invoke Document AI to extract invoice line items, (2) call an internal Cloud Run microservice to validate the vendor tax ID, (3) wait up to 48 hours for a manager's HTTP callback approval if the invoice exceeds $50,000, and (4) insert the approved record into BigQuery with built-in retries and error handling. Which service should orchestrate this stateful multi-step process?",
    options: [
      { id: "A", text: "Cloud Workflows triggered by Eventarc on the Cloud Storage object finalize event." },
      { id: "B", text: "A single synchronous Cloud Run Function that runs `time.sleep()` for 48 hours while waiting for the manager." },
      { id: "C", text: "Cloud Router with BGP route policies." },
      { id: "D", text: "BigQuery BI Engine." }
    ],
    correctIds: ["A"],
    explanation: "**Cloud Workflows** (triggered via **Eventarc** when the PDF lands in Cloud Storage) is Google Cloud's serverless stateful orchestration engine for HTTP APIs and GCP services. Unlike Cloud Functions/Cloud Run (which max out at 60 minutes for HTTP requests and charge for active runtime), Workflows can pause at **callback endpoints for days/months (up to 1 year)** at virtually zero cost while waiting for human approval!",
    optionBreakdown: {
      A: "Correct. Eventarc + Cloud Workflows orchestrates serverless API steps, retries, conditional branches, and long-running human approval callbacks.",
      B: "Incorrect. Cloud Run Functions time out after 60 minutes and charge continuously during `sleep()`.",
      C: "Incorrect. Cloud Router is a BGP network routing service.",
      D: "Incorrect. BI Engine is an in-memory BigQuery caching service."
    }
  },
  {
    id: "q-d6-5",
    domainId: "domain-6",
    caseStudyId: null,
    difficulty: "Medium",
    multiSelect: false,
    stem: "Your microservices application on GKE uses Cloud Pub/Sub to process customer order events. Recently, a malformed JSON message was published to the `orders-topic`. The consumer microservice throws an unhandled parsing exception and returns a `NACK` every time Pub/Sub delivers that message, causing Pub/Sub to redeliver the same malformed message endlessly and clogging the subscription backlog. How should you prevent poison-pill messages from blocking the subscription while preserving the failed messages for debugging?",
    options: [
      { id: "A", text: "Configure a Dead-Letter Topic (DLT) on the Pub/Sub subscription with a `max-delivery-attempts` threshold (e.g., 5 attempts), and attach a subscription to the Dead-Letter Topic for inspection and alerting." },
      { id: "B", text: "Set the Pub/Sub message retention duration to 10 minutes so all messages are deleted quickly." },
      { id: "C", text: "Modify the consumer microservice to silently return `ACK` on all exceptions and discard failed orders without logging." },
      { id: "D", text: "Replace Cloud Pub/Sub with Cloud DNS." }
    ],
    correctIds: ["A"],
    explanation: "In **Cloud Pub/Sub**, configuring a **Dead-Letter Topic (Dead-Letter Queue / DLT)** with `max-delivery-attempts` (between 5 and 100) automatically forwards undeliverable 'poison-pill' messages to a separate quarantine topic after N failed delivery attempts. This unblocks the primary consumer pipeline while preserving the bad messages for engineering inspection and replay.",
    optionBreakdown: {
      A: "Correct. A Dead-Letter Topic quarantines poison-pill messages after `max-delivery-attempts` without losing data.",
      B: "Incorrect. Lowering retention to 10 minutes risks losing valid unacknowledged orders during any brief consumer outage.",
      C: "Incorrect. Silently ACK-ing and dropping failed orders causes silent data loss.",
      D: "Incorrect. Cloud DNS is a domain name resolution service, not a message broker."
    }
  },
  {
    id: "q-hrl-4",
    domainId: "domain-1",
    caseStudyId: "helicopter-racing-league",
    difficulty: "Medium",
    multiSelect: false,
    stem: "For this question, refer to the Helicopter Racing League (HRL) case study. HRL wants to analyze live social media posts and fan chat streams in multiple languages during races to measure crowd sentiment and engagement in real time. HRL's engineering team wants to implement this feature as quickly as possible without hiring machine learning researchers to build or train custom NLP models from scratch. Which Google Cloud solution should they use?",
    options: [
      { id: "A", text: "Use the pre-trained Cloud Translation API and Cloud Natural Language API (or Gemini API on Vertex AI) invoked from the streaming pipeline." },
      { id: "B", text: "Provision a 16-node Compute Engine A3 cluster with NVIDIA H100 GPUs and train a custom transformer model from scratch in PyTorch." },
      { id: "C", text: "Store the chat messages in Cloud Filestore and hire human translators to label them after the season ends." },
      { id: "D", text: "Use Cloud Vision API Optical Character Recognition (OCR) on the text JSON payloads." }
    ],
    correctIds: ["A"],
    explanation: "Following Google Cloud's AI/ML hierarchy rule: when a standard capability (multilingual translation and sentiment analysis) is needed quickly without custom training data or ML research overhead, always choose **Pre-trained Google Cloud AI APIs** (**Cloud Natural Language API** for sentiment/entity analysis + **Cloud Translation API** or **Vertex AI Gemini API**).",
    optionBreakdown: {
      A: "Correct. Pre-trained Cloud Natural Language API and Translation API provide immediate multilingual sentiment analysis with zero model training required.",
      B: "Incorrect. Training a custom LLM from scratch on H100 GPUs is slow, expensive, and violates the 'minimal ML overhead' requirement.",
      C: "Incorrect. Manual post-season translation fails the real-time sentiment requirement.",
      D: "Incorrect. Cloud Vision API is for images, not text chat streams."
    }
  },
  {
    id: "q-te-4",
    domainId: "domain-3",
    caseStudyId: "terramearth",
    difficulty: "Medium",
    multiSelect: false,
    stem: "For this question, refer to the TerramEarth case study. TerramEarth stores all 20 million vehicles' telemetry in a single multi-tenant BigQuery table in their central analytics project. They want to grant 500 independent regional dealerships SQL access to query vehicle performance data, while strictly ensuring that each dealership can ONLY see rows where `dealer_id` matches their own dealership—without duplicating the 500 TB table into 500 separate tables. What should you configure?",
    options: [
      { id: "A", text: "Configure BigQuery Row-Level Security policies (`CREATE ROW ACCESS POLICY`) or an Authorized View filtering by `SESSION_USER()` / group mapping against `dealer_id`." },
      { id: "B", text: "Copy the 500 TB table into 500 separate BigQuery projects every night using Cloud Composer." },
      { id: "C", text: "Grant every dealership `roles/bigquery.dataOwner` on the central table and ask them to always include `WHERE dealer_id = ...` in their queries." },
      { id: "D", text: "Use Cloud KMS Customer-Supplied Encryption Keys (CSEK) with a different key per row." }
    ],
    correctIds: ["A"],
    explanation: "**BigQuery Row-Level Security** (`CREATE ROW ACCESS POLICY`) and **Authorized Views** using `SESSION_USER()` allow multi-tenant data isolation inside a single shared BigQuery table without duplicating storage or managing 500 separate ETL pipelines.",
    optionBreakdown: {
      A: "Correct. BigQuery Row-Level Security and Authorized Views enforce strict per-tenant row filtering on a single table without data duplication.",
      B: "Incorrect. Duplicating 500 TB across 500 tables wastes massive storage and ETL compute costs.",
      C: "Incorrect. Relying on external users to voluntarily type a `WHERE` clause with `dataOwner` permissions is a major data breach.",
      D: "Incorrect. BigQuery does not support CSEK or per-row KMS keys."
    }
  },
  {
    id: "q-mk-4",
    domainId: "domain-2",
    caseStudyId: "mountkirk-games",
    difficulty: "Medium",
    multiSelect: false,
    stem: "For this question, refer to the Mountkirk Games case study. Mountkirk's dedicated multiplayer game servers run on Regional GKE clusters and communicate with mobile players using a custom stateful UDP protocol that requires preserving the player's original source IP address and minimizing network hop latency. Which Google Cloud Load Balancer should front the regional UDP game server pods?",
    options: [
      { id: "A", text: "Regional External Passthrough Network Load Balancer." },
      { id: "B", text: "Global External Application Load Balancer (HTTP/HTTPS)." },
      { id: "C", text: "Global External SSL Proxy Load Balancer." },
      { id: "D", text: "Global External TCP Proxy Load Balancer." }
    ],
    correctIds: ["A"],
    explanation: "Only the **Regional External Passthrough Network Load Balancer** supports **UDP traffic** AND **preserves the original client source IP address** without proxying packets (delivering packets directly to backends via Maglev for minimal gaming latency). Application, SSL Proxy, and TCP Proxy Load Balancers are all proxies that only support HTTP(S) or TCP—none of them support UDP!",
    optionBreakdown: {
      A: "Correct. Passthrough Network Load Balancer supports UDP, preserves client source IPs, and offers the lowest possible packet latency.",
      B: "Incorrect. Application Load Balancers only support HTTP/HTTPS/gRPC/WebSockets, not raw UDP.",
      C: "Incorrect. SSL Proxy Load Balancers only support TCP with SSL/TLS termination, not UDP.",
      D: "Incorrect. TCP Proxy Load Balancers only support TCP, not UDP."
    }
  }
];

