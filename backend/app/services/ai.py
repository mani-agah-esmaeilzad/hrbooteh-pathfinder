"""
AI service for handling assessment conversations
This is a stub implementation that simulates AI responses.
You can replace it with real OpenAI/Anthropic integration later.
"""

from typing import Tuple, Dict, Any
from dataclasses import dataclass
import random


@dataclass
class AIConfig:
    temperature: float = 0.7
    max_tokens: int = 400


class AIService:
    def __init__(self, config: AIConfig | None = None) -> None:
        self.config = config or AIConfig()

    def start_assessment(self, assessment_type: str, user_context: str | None = None) -> Tuple[str, bool, bool]:
        """Return initial AI message, should_continue, analysis_ready"""
        greeting = (
            f"سلام! به ارزیابی {assessment_type} خوش آمدید. "
            "چند سؤال از شما می‌پرسم تا بتوانم تحلیل دقیقی ارائه دهم. آماده‌اید؟"
        )
        return greeting, True, False

    def respond(self, assessment_type: str, history: list[Dict[str, str]], user_message: str) -> Tuple[str, bool, bool]:
        """Return AI reply, should_continue, analysis_ready"""
        # Very naive logic to simulate a flow
        followups = [
            "می‌توانید بیشتر توضیح بدهید؟",
            "یک مثال از تجربه‌تان بزنید.",
            "اگر در شرایط سخت قرار بگیرید، چه می‌کنید؟",
            "در یک کلمه، احساس خودتان را توصیف کنید.",
        ]
        if len(history) >= 5:
            analysis_ready = True
            reply = "ممنون از توضیحاتتان. تحلیل شما آماده شد."
            return reply, False, analysis_ready
        else:
            reply = random.choice(followups)
            return reply, True, False

    def build_analysis(self, assessment_type: str, messages: list[Dict[str, str]]) -> Dict[str, Any]:
        """Return a fake analysis based on conversation length"""
        score = min(100, 20 + len(messages) * 15)
        return {
            "assessment_type": assessment_type,
            "score": score,
            "summary": "تحلیل اولیه بر اساس پاسخ‌های ارائه‌شده.",
            "recommendations": [
                "تمرین روزانه ۱۵ دقیقه برای بهبود تمرکز",
                "شرکت در یک کارگاه مرتبط با موضوع",
            ],
        }


ai_service = AIService()
