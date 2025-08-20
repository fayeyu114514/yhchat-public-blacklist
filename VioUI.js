// VioUI JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // 移动端下拉菜单切换
    document.querySelectorAll('.dropdown-toggle').forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.parentElement.classList.toggle('active');
            }
        });
    });
    
    // 滚动时添加阴影效果
    const navbar = document.querySelector('.vio-navbar');
if (navbar) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2), inset 1px 1px 25px -8px var(--glass-shadow-color)';
            navbar.style.backdropFilter = 'blur(12px) saturate(200%)';
            navbar.style.webkitBackdropFilter = 'blur(12px) saturate(200%)';
            navbar.style.transform = 'translateY(2px) scale(0.995)';
        } else {
            navbar.style.boxShadow = '0px 6px 20px rgba(0, 0, 0, 0.1), inset 1px 1px 25px -8px var(--glass-shadow-color)';
            navbar.style.backdropFilter = 'blur(8px) saturate(180%)';
            navbar.style.webkitBackdropFilter = 'blur(8px) saturate(180%)';
            navbar.style.transform = 'translateY(0) scale(1)';
        }
    });
}
    
    // 点击页面其他区域关闭移动菜单
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && navLinks && navLinks.classList.contains('active')) {
            if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
                navLinks.classList.remove('active');
            }
        }
    });
    
    // 按钮点击效果
    document.querySelectorAll('.vio-btn').forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // 下拉菜单动画优化
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                const menu = this.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.display = 'block';
                    setTimeout(() => {
                        menu.style.display = '';
                    }, 10);
                }
            }
        });
    });
    
    // 键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // ESC键关闭所有下拉菜单
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
            });
            
            // 关闭移动菜单
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
    
    console.log('VioUI 已成功加载');
});

// 玻璃效果控制
document.addEventListener('DOMContentLoaded', function() {
    const toggleControlsBtn = document.getElementById('toggle-glass-controls');
    const closeControlsBtn = document.getElementById('close-glass-controls');
    const controlsPanel = document.getElementById('glass-controls');
    
    if (toggleControlsBtn && controlsPanel) {
        toggleControlsBtn.addEventListener('click', function() {
            controlsPanel.style.display = controlsPanel.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    if (closeControlsBtn && controlsPanel) {
        closeControlsBtn.addEventListener('click', function() {
            controlsPanel.style.display = 'none';
        });
    }
    
    // 玻璃效果控制逻辑
    function updateGlassEffect() {
        const blurValue = document.getElementById('glass-blur')?.value || 2;
        const opacityValue = document.getElementById('glass-opacity')?.value || 40;
        const shadowValue = document.getElementById('glass-shadow')?.value || 5;
        
        document.documentElement.style.setProperty('--glass-frost-blur', blurValue + 'px');
        document.documentElement.style.setProperty('--glass-tint-opacity', opacityValue / 100);
        document.documentElement.style.setProperty('--glass-shadow-spread', '-' + shadowValue + 'px');
    }
    
    // 监听控制滑块的变化
    document.querySelectorAll('#glass-controls input[type="range"]').forEach(input => {
        input.addEventListener('input', updateGlassEffect);
    });
    
    // 初始化效果
    updateGlassEffect();
});