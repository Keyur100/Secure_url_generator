# 🔐 Secure URL Generator

# 🚀 A secure, self-hosted URL shortener / one-time secret sharing service.

This project automates the deployment of the **Secure URL Generator** web application using:

- **Docker Compose** (for local testing)
- **Terraform** (for infrastructure provisioning)
- **Ansible** (for remote deployment on provisioned EC2 instances)

---

## 📦 Project Structure

\`\`\`
AINTERV/
├── one-time-secret-backend/                 # Node backend (API)
├── one-time-secret-frontend/                # React frontend
├── docker-compose.yml       # Local Docker setup
├── terraform/               # Infrastructure provisioning
│   ├── main.tf
│   └── infra ...
├── ansible/
│   ├── playbook.yml         # Ansible playbook
│   ├── group_vars/all.yml   # Git repo & path config
│   ├── inventory/hosts.ini  # Generated dynamically
│   └── roles/
│       ├── setup/
│       └── deploy/
└── README.md
\`\`\`

---

## 🖥️ Run Locally (Docker Compose)

### 🔧 Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- MongoDB will run via Docker container

### 🚀 Steps

\`\`\`bash
git clone https://github.com/Keyur100/Secure_url_generator.git
cd AINTERV
docker-compose up -d
\`\`\`

The app should now be running locally at \`http://localhost:3000\`.

---

## ☁️ Deploy on Remote EC2 (Terraform + Ansible)

### �� Requirements

- Terraform ≥ 1.0
- Ansible ≥ 2.10
- AWS credentials set (via \`~/.aws/credentials\` or env vars)
- SSH key present (named \`cloud-terra-key.pem\`)

### 1️⃣ Provision Infra (Terraform)

\`\`\`bash
cd terraform
terraform init
terraform apply
# For development
terraform apply -var="environment=dev"

# For production
terraform apply -var="environment=prod"
\`\`\`

\`\`\`

📤 After applying, Terraform will create a \`terraform_output.json\` file.
\`terraform_output.json - output\` 
{
  "dev_infra_ec2_public_ips": {
    "value": ["1.2.3.4", "5.6.7.8"]
  },
  "stg_infra_ec2_public_ips": {
    "value": ["9.8.7.6"]
  },
  "prd_infra_ec2_public_ips": {
    "value": []
  }
}

---

### 2️⃣ Generate Inventory for Ansible

\`\`\`bash
cd ../ansible
python generate_inventory.py  # Reads terraform_output.json and writes inventory/hosts.ini
\`\`\`

🧾 hosts.ini Structure (Ansible Inventory)
[dev]
1.2.3.4 ansible_user=ubuntu ansible_ssh_private_key_file=../terraform/cloud-terra-key
5.6.7.8 ansible_user=ubuntu ansible_ssh_private_key_file=../terraform/cloud-terra-key

[stg]
9.8.7.6 ansible_user=ubuntu ansible_ssh_private_key_file=../terraform/cloud-terra-key

[prd]

---

### 3️⃣ Configure Variables

Edit \`ansible/group_vars/all.yml\`:

\`\`\`yaml
git_repo: https://github.com/Keyur100/Secure_url_generator.git
clone_dir: /home/{{ ansible_user }}/AINTERV
\`\`\`

---

### 4️⃣ Run Ansible Playbook

\`\`\`bash
cd ansible
ansible-playbook -i inventory/hosts.ini playbook.yml
\`\`\`

---

## 🔄 What Ansible Does

1. Installs Docker & Docker Compose
2. Clones the Git repo to \`clone_dir\`
3. Runs \`docker-compose up -d\` inside the project

---

## 📁 Useful Files

| File | Purpose |
|------|---------|
| \`terraform_output.json\` | Terraform outputs used for Ansible inventory |
| \`ansible/inventory/hosts.ini\` | Auto-generated Ansible inventory file |
| \`ansible/group_vars/all.yml\` | Holds shared variables like \`git_repo\` & \`clone_dir\` |

---

## ✅ To Do

- [ ] Add domain + SSL (e.g., via Nginx & Let's Encrypt)
- [ ] Add monitoring/healthcheck
- [ ] CI/CD pipeline

---

## 🧑‍💻 Author

Made by [Keyur Prajapati](https://github.com/Keyur100)
