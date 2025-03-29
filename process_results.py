import pandas as pd
import requests
from datetime import datetime
from openai import OpenAI
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

# Read the results
df = pd.read_csv('result.csv', encoding='utf-8-sig')
df = df[df['created_at'].notna()]
df['created_at'] = pd.to_datetime(df['created_at'])

# Initialize DeepSeek client
client = OpenAI(api_key="sk-ceeab91f573048c484bfdc571146fa23", base_url="https://api.deepseek.com")

def get_readme_content(repo_name):
    """Fetch README content from GitHub API"""
    if "/" not in repo_name:
        return ""
    
    owner, repo = repo_name.split("/", 1)
    url = f"https://api.github.com/repos/{owner}/{repo}/readme"
    try:
        response = requests.get(
            url,
            headers={
                "Accept": "application/vnd.github+json",
                "Authorization": f"Bearer {''}",
                "X-GitHub-Api-Version": "2022-11-28"
            }
        )
        if response.status_code == 200:
            data = response.json()
            if data.get("content"):
                import base64
                return base64.b64decode(data["content"]).decode('utf-8', errors='replace')
            return ""
        print(f"GitHub API error for {repo_name}: {response.status_code}")
        return ""
    except Exception as e:
        print(f"Error fetching README for {repo_name}: {str(e)}")
        return ""

def calculate_score(row):
    """Calculate a score based on repo metrics"""
    # Calculate hours since creation
    hours_since_creation = int((datetime.now().replace(tzinfo=row['created_at'].tzinfo) - row['created_at']).total_seconds() / 3600)
    
    # Higher score for newer repos with more stars
    score = (
        (row['current_star_count'] * 0.6) +
        (row['star_count'] * 0.4) +
        (100 - hours_since_creation) * 0.2
    )
    return round(score, 2)

def analyze_with_deepseek(repo_data):
    """Get analysis from DeepSeek in Chinese"""
    prompt = f"""
    请用中文分析这个GitHub仓库并给出1-10分的评分:
    名称: {repo_data['repo_name']}
    创建时间: {repo_data['created_at']}
    近期获得的star数: {repo_data['star_count']}
    总star数: {repo_data['current_star_count']}
    
    请用中文总结该仓库的特点，并给出1-10分的评分(10分为最高)。
    评分标准:
    - 技术价值(40%)
    - 社区关注度(30%) 
    - 增长潜力(20%)
    - 文档质量(10%)
    """
    
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "你是一个专业的GitHub仓库分析师"},
            {"role": "user", "content": prompt},
        ],
        stream=False
    )
    return response.choices[0].message.content

def process_repo(row):
    """Process a single repository"""
    repo_data = {
        "repo_name": row['repo_name'],
        "created_at": row['created_at'],
        "star_count": row['star_count'],
        "current_star_count": row['current_star_count'],
        "readme": get_readme_content(row['repo_name']),
        "score": calculate_score(row),
        "deepseek_analysis": analyze_with_deepseek(row)
    }
    return repo_data

# Process top 10 newest repos in parallel
top_repos = df.sort_values('created_at', ascending=False).head(10)
results = []

with ThreadPoolExecutor(max_workers=5) as executor:
    futures = [executor.submit(process_repo, row) for _, row in top_repos.iterrows()]
    for future in tqdm(as_completed(futures), total=len(futures), desc="Processing repos"):
        results.append(future.result())

# Sort by score descending
results.sort(key=lambda x: x['score'], reverse=True)

# Save to file
with open('analyzed_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, default=str)

print("分析完成，结果已保存到 analyzed_results.json")
