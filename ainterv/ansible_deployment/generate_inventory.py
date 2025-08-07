import json

# Configuration
ansible_user = "ubuntu"
ssh_key_path = "../terraform/cloud-terra-key"

# Load Terraform output from JSON file
with open("terraform_output.json") as f:
    data = json.load(f)

# Write the Ansible inventory file
with open("hosts.ini", "w") as f:
    for env in ["dev", "stg", "prd"]:
        key = f"{env}_infra_ec2_public_ips"
        f.write(f"[{env}]\n")
        
        # Write IPs for this environment
        for ip in data.get(key, {}).get("value", []):
            f.write(f"{ip} ansible_user={ansible_user} ansible_ssh_private_key_file={ssh_key_path}\n")
        
        f.write("\n")
