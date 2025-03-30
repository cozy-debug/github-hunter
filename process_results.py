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
client = OpenAI(api_key="sk-5a2fa34f902b4d38aa65b3b74dc718fe", base_url="https://dashscope.aliyuncs.com/compatible-mode/v1")

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
                print('readme')
                return base64.b64decode(data["content"]).decode('utf-8', errors='replace')
                
            return ""
        
        print(f"GitHub API error for {repo_name}: {response.status_code}")
        return ""
    except Exception as e:
        print(f"Error fetching README for {repo_name}: {str(e)}")
        return ""

def get_score_from_deepseek(repo_data):
    """Get numeric score from DeepSeek"""
    prompt = f"""
    请直接给这个GitHub仓库1-10分的评分(10分为最高):
    名称: {repo_data['repo_name']}
    创建时间: {repo_data['created_at']}
    README预览: {repo_data['readme'][:500] if repo_data['readme'] else "无README内容"}
    
    只需返回数字评分，例如: 8
    """
    
    response = client.chat.completions.create(
        model="qwen-turbo-latest",
        messages=[
            {"role": "system", "content": "你是一个专业的GitHub仓库评分系统"},
            {"role": "user", "content": prompt},
        ],
        stream=False
    )
    try:
        return float(response.choices[0].message.content.strip())
    except:
        return 5  # default if parsing fails

def analyze_with_deepseek(repo_data):
    """Get analysis from DeepSeek in Chinese"""
    readme_preview = repo_data['readme'][:500] + "..." if repo_data['readme'] else "无README内容"
    prompt = f"""
    请用中文分析这个GitHub仓库并给出1-10分的评分:
    名称: {repo_data['repo_name']}
    创建时间: {repo_data['created_at']}
    近期获得的star数: {repo_data['star_count']}
    总star数: {repo_data['current_star_count']}
    README预览: {readme_preview}
    
    请用中文总结该仓库的特点，并给出1-10分的评分(10分为最高)。
    评分标准:
    - 技术价值(40%)
    - 社区关注度(30%) 
    - 增长潜力(20%)
    - 文档质量(10%)
    """
    
    response = client.chat.completions.create(
        model="qwen-turbo-latest",
        messages=[
            {"role": "system", "content": "你是一个专业的GitHub仓库分析师"},
            {"role": "user", "content": prompt},
        ],
        stream=False
    )
    res = response.choices[0].message.content
    return res

def summarize_with_deepseek(repo_data):
    """Get concise plain text summary from DeepSeek in Chinese"""
    prompt = f"""
    请用中文为这个GitHub仓库提供一个简短的纯文本简介(不要使用markdown格式):
    名称: {repo_data['repo_name']}
    近期获得的star数: {repo_data['star_count']}
    README预览: {repo_data['readme'][:200] if repo_data['readme'] else "无README内容"}
    
    请用1-2句话简洁描述该仓库的主要功能和特点，不要包含评分或分析。
    """
    
    response = client.chat.completions.create(
        model="qwen-turbo-latest",
        messages=[
            {"role": "system", "content": "你是一个简洁的GitHub仓库简介生成器"},
            {"role": "user", "content": prompt},
        ],
        stream=False
    )
    return response.choices[0].message.content.strip()

def process_repo(row):
    """Process a single repository"""
    # First get readme content
    readme_content = get_readme_content(row['repo_name'])
    
    # Create repo_data with basic fields
    repo_data = {
        "repo_name": row['repo_name'],
        "created_at": row['created_at'],
        "star_count": row['star_count'],
        "current_star_count": row['current_star_count'],
        "readme": readme_content
    }
    
    # Get score, analysis and summary using complete repo_data
    repo_data["score"] = get_score_from_deepseek(repo_data)
    repo_data["deepseek_analysis"] = analyze_with_deepseek(repo_data)
    repo_data["summary"] = summarize_with_deepseek(repo_data)
    
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
print(results)
# Save to files
with open('analyzed_results.json', 'w') as f:
    json.dump(results, f, indent=2, default=str)

# Convert to DataFrame and save as CSV
results_df = pd.DataFrame(results)
results_df.to_csv('analyzed_results.csv', index=False, encoding='utf-8-sig')

print("分析完成，结果已保存到 analyzed_results.json 和 analyzed_results.csv")
