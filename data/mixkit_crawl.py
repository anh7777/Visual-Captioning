import os
import json
import requests
import time
import random
from bs4 import BeautifulSoup

# URL trang web gốc
BASE_URL = "https://mixkit.co"

# Danh mục cần thu thập
CATEGORIES = [
    "food", "drink", "coffee", "tea", "fruit", "corn", "beer",
    "cocktail", "salad", "eating", "vegetable", "fast-food", "restaurant"
]

# Số trang tối đa cần crawl cho mỗi danh mục
MAX_PAGES = 50

# Danh sách User-Agent để tránh bị chặn
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/537.36"
]

# Dùng session để tối ưu tốc độ
session = requests.Session()

def get_headers():
    """Chọn ngẫu nhiên User-Agent để tránh bị chặn"""
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Referer": "https://google.com",
        "Accept-Language": "en-US,en;q=0.9"
    }

def scrape_category(category):
    """Hàm thu thập dữ liệu từ một danh mục cụ thể"""
    category_url = f"{BASE_URL}/free-stock-video/{category}/"
    print(f"\n📂 Đang thu thập danh mục: {category}")

    videos = []
    
    for page in range(1, MAX_PAGES + 1):
        page_url = f"{category_url}?page={page}"
        print(f"🔍 Đang thu thập dữ liệu từ {page_url}...")

        try:
            response = session.get(page_url, headers=get_headers(), timeout=10)
            
            # Nếu không thể tải trang, bỏ qua danh mục
            if response.status_code != 200:
                print(f"❌ Không thể tải trang {page_url}, có thể đã hết trang hoặc bị chặn.")
                break

            soup = BeautifulSoup(response.text, "html.parser")
            video_items = soup.select(".item-grid-card")

            # Nếu không có dữ liệu, dừng lại ngay
            if not video_items:
                print("✅ Đã thu thập hết dữ liệu!")
                break

            for item in video_items:
                title = item.select_one(".item-grid-card__title a")
                description = item.select_one(".item-grid-card__description")
                thumbnail = item.select_one(".item-grid-video-player__thumb")
                video_link = item.select_one(".item-grid-video-player__video")

                videos.append({
                    "Tiêu đề": title.text.strip() if title else "Không có tiêu đề",
                    "Mô tả": description.text.strip() if description else "Không có mô tả",
                    "Thumbnail": thumbnail["src"] if thumbnail else "Không có thumbnail",
                    "Video": video_link["src"] if video_link else "Không tìm thấy video"
                })

        except requests.RequestException as e:
            print(f"⚠️ Lỗi khi tải dữ liệu từ {page_url}: {e}")
            break
        
        # Nghỉ ngẫu nhiên 2-5 giây giữa các request
        time.sleep(random.uniform(2, 5))

    print(f"📌 Tổng số video thu thập cho danh mục {category}: {len(videos)}")
    return videos
SAVE_PATH = os.path.join(os.path.dirname(__file__), "mixkit_data.json")
# Tạo file JSON nếu chưa tồn tại
if not os.path.exists(SAVE_PATH):
    with open(SAVE_PATH, "w", encoding="utf-8") as file:
        json.dump({}, file, indent=4, ensure_ascii=False)
# Tạo thư mục chứa file JSON nếu chưa tồn tại

# Bắt đầu thu thập dữ liệu
for category in CATEGORIES:
    category_data = scrape_category(category)
    
    # Lưu dữ liệu vào JSON file ngay sau khi hoàn thành danh mục
    with open(SAVE_PATH, "a", encoding="utf-8") as file:
        json.dump({category: category_data}, file, indent=4, ensure_ascii=False)
        file.write("\n")  # Thêm dòng mới để dễ đọc

print(f"\n✅ Đã lưu toàn bộ dữ liệu vào {SAVE_PATH} 🎉")