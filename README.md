# Google Cloud Professional Cloud Architect (PCA) Mastery & Exam Simulator

A comprehensive, zero-dependency interactive web application designed to help engineers and architects deeply understand **Google Cloud architecture** and pass the **Google Cloud Professional Cloud Architect (PCA)** certification exam.

---

## 🚀 Quick Start

Because the application is built with native ES Modules, HTML5, and modern CSS3 (with zero build step or external framework dependencies required), you can launch it immediately with any static HTTP server:

### Option 1: Using Python 3 (Recommended)
```bash
python3 -m http.server 8080
```
Then open **[http://localhost:8080](http://localhost:8080)** in your browser.

### Option 2: Using Node.js (`npx serve`)
```bash
npx serve -l 8080 .
```

---

## 🎯 Why the PCA Exam Is Challenging (And How This App Solves It)

The Google Cloud Professional Cloud Architect exam (**50–60 questions, 120 minutes, ~70% passing score**) does not test rote memorization of product definitions. Instead, it tests your ability to:
1. **Evaluate subtle architectural trade-offs** (e.g., *Shared VPC vs. VPC Peering vs. Private Service Connect*, *CMEK vs. CSEK vs. Cloud EKM*, *Cloud Spanner vs. AlloyDB vs. Cloud Bigtable*).
2. **Eliminate architectural anti-patterns** (e.g., downloading Service Account JSON keys instead of using *Workload Identity* or *Workload Identity Federation*, starting Bigtable/Spanner keys with monotonic timestamps, or checking shared downstream databases inside MIG autohealing liveness probes).
3. **Translate Case Study business & technical constraints into GCP architectures** (~25–30% of the exam directly references the 4 official Google Cloud Case Studies).

---

## 🧭 Recommended 4-Step Study Workflow

### Step 1: Master the 5 Core GCP Pillars (`GCP Deep-Dive Encyclopedia`)
Read through each of the 5 deep-dive architectural modules and mark them as mastered as you go:
- **Compute & Containers**: GCE Machine Families, Stateful vs. Stateless MIGs, Spot VMs, Sole-Tenant Nodes (BYOL), GKE Autopilot vs. Standard, Workload Identity, Dataplane V2, Binary Authorization, and Cloud Run (Services vs. Jobs, Direct VPC Egress, Concurrency & `min-instances`).
- **Networking & Hybrid Connectivity**: Shared VPC, VPC Network Peering (non-transitive limits), Private Service Connect (PSC for overlapping CIDRs), HA VPN vs. Dedicated/Partner Interconnect, encrypting Interconnect traffic (HA VPN over Interconnect / MACsec), Private Google Access, Cloud NAT, and the Global/Regional Load Balancing matrix.
- **Storage & Databases**: Cloud SQL (HA Regional Persistent Disk vs. Cross-Region Read Replicas), AlloyDB for PostgreSQL (Columnar Engine, 99.99% SLA), Cloud Spanner (TrueTime, multi-region active-active, primary key hotspot prevention), Cloud Bigtable (row-key design), Firestore, Memorystore for Redis, Cloud Storage (Storage Classes, Autoclass, Bucket Lock WORM, Signed URLs), and Filestore (`ReadWriteMany` NFS).
- **Data Analytics & AI/ML**: BigQuery (Partitioning, Clustering, 90-day Long-Term Storage automatic discount, Authorized Views, Row-Level Security, Column-Level Policy Tags), Pub/Sub (Ordering keys, Dead-Letter Topics, BigQuery Subscriptions), Dataflow (Apache Beam event-time windowing, watermarks, and triggers for late-arriving data), Ephemeral Dataproc on GCS with Spot secondary workers, and the 4-tier AI/ML Decision Matrix.
- **Security, IAM, Governance & SRE**: Resource Hierarchy, Organization Policies, GCDS + SAML SSO, Workload Identity Federation, Cloud KMS (GMEK/CMEK/CSEK/EKM), Sensitive Data Protection (Cloud DLP Crypto-Deterministic & Format-Preserving Encryption for SQL `JOIN`s), VPC Service Controls (VPC-SC), IAP TCP Forwarding (`35.235.240.0/20`), SLIs/SLOs/SLAs/Error Budgets, Cloud Profiler vs. Cloud Trace, and Cloud Logging Aggregated Sinks & Exclusion Filters.

### Step 2: Decode the 4 Official PCA Case Studies (`4 Official Case Studies`)
Study the complete architectural blueprints and **Requirement → GCP Service Translations** for:
1. **EHR Healthcare** (HIPAA compliance, hybrid Interconnect + HA VPN encryption, GKE Enterprise/Anthos, Cloud DLP tokenization, Apigee partner onboarding)
2. **Helicopter Racing League (HRL)** (Global live video streaming with Cloud CDN, Race Truck edge, Pub/Sub → Dataflow → Bigtable/BigQuery telemetry, real-time Vertex AI predictions)
3. **Mountkirk Games** (Global multiplayer gaming backend on GKE, Cloud Spanner multi-region transactional state, Memorystore Redis leaderboards, Pub/Sub + Dataflow watermarks for late-arriving mobile telemetry)
4. **TerramEarth** (20M industrial IoT vehicles, cellular streaming + maintenance depot parallel composite GCS batch uploads, unified Apache Beam/Dataflow pipelines, BigQuery 90-day long-term storage, Apigee dealer platform)

### Step 3: Drill Pattern Recognition (`Service Decision Trees` & `Keyword Decoder`)
- Walk through the interactive **Compute**, **Database & Storage**, and **Hybrid Networking** decision wizards.
- Use the **Exam Keyword Trigger Decoder** and **Active Recall Flashcards** to build instant recognition of classic exam phrases.

### Step 4: Assess Yourself in the `Exam Simulator`
- **🎓 Tutor / Study Mode**: Filter by specific PCA Exam Section or Case Study, check answers immediately, and read the **Option-by-Option Distractor Breakdown** explaining why the right answer wins and why each distractor fails.
- **⏱️ Timed Exam Simulation Mode**: Simulates the real exam experience with a countdown timer, question flagging, palette navigation, an interactive **Case Study Exhibit Modal**, and a complete **Post-Exam Diagnostic Score Report** (measured against the 70% passing threshold).

---

## 📁 Project Structure

```text
/home/abdelouahab/gcp-arch/
├── index.html              # Main application layout, navigation shell, and Case Study Exhibit modal
├── styles.css              # Dark-mode Google Cloud Architect UI theme and responsive layout
├── app.js                  # Interactive SPA controller, Exam Simulator engine, and localStorage state
├── README.md               # Documentation and study guide
└── data/
    ├── domains.js          # 6 Official PCA Exam Sections & 5 Deep-Dive GCP Knowledge Modules
    ├── caseStudies.js      # Deep-dive analysis & architecture blueprints for all 4 Official Case Studies
    ├── decisionTrees.js    # Interactive Decision Tree graphs, 30+ Keyword Decoders, and Flashcards
    └── questions.js        # 48 realistic, scenario-based PCA exam questions with option-by-option rationales
```

---

## 🛠️ Customizing or Adding Questions

All content is modularly stored in `data/*.js`:
- To add new exam questions, append an object to `EXAM_QUESTIONS` in [`data/questions.js`](file:///home/abdelouahab/gcp-arch/data/questions.js) with `id`, `domainId` (`domain-1` through `domain-6`), `caseStudyId` (`null` or case study slug), `multiSelect`, `stem`, `options`, `correctIds`, `explanation`, and `optionBreakdown`.
- Your study progress, mastered modules, bookmarked questions, and exam history are automatically saved in your browser's `localStorage` under the key `gcp_pca_architect_hub_v1` (and can be reset anytime from the bottom-left sidebar button).
