class NameMealType:
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"


NAME_MEAL_TYPE_CHOICES = (
    (NameMealType.BREAKFAST, "Завтрак"),
    (NameMealType.LUNCH, "Обед"),
    (NameMealType.DINNER, "Ужин"),
    (NameMealType.SNACK, "Перекус"),
)

class MessageType:
    bug = "bug"
    
MESSAGE_TYPE_CHOICES = (
    (MessageType.bug, "Сообщение об ошибке")
)