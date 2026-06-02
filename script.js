// Полностью оптимизированный скрипт для сайта civvu
document.addEventListener('DOMContentLoaded', () => {
    console.log('Сайт civvu успешно запущен и оптимизирован!');
    
    // Автоматически настраиваем рамку для первой активной кнопки плеера при старте
    const firstBtn = document.querySelector('.playlist-btn');
    if (firstBtn) {
        firstBtn.style.borderColor = '#d4af37';
    }
});
