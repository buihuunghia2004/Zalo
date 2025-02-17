/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			'dark-1': '#121416',
  			'dark-2': '#16191D',
  			'dark-3': '#22262B',
  			'dark-4': '#2D3136',
  			'dark-5': '#595B5F',
  			'blue-1': '#0068FF',
				// Nền của danh sách chat, khung nhập tin nhắn
        'gray-zalo-lightest': '#F7F7F7', 

        // Nền tin nhắn nhận, phân tách nội dung
        'gray-zalo-lighter': '#F1F1F1', 

        // Viền khung nhập, đường kẻ phân cách
        'gray-zalo-light': '#E5E5E5', 

        // Viền avatar, viền nút bấm phụ
        'gray-zalo-medium': '#D1D1D1', 

        // Màu chữ mô tả, thời gian tin nhắn
        'gray-zalo-secondary': '#A1A1A1', 

        // Màu chữ phụ trong danh sách chat
        'gray-zalo-dark': '#666666', 

        // Màu chữ tiêu đề, thông tin quan trọng
        'gray-zalo-darker': '#444444',

				// Màu chủ đạo (Primary)
        'zalo-primary': '#0068FF', // Xanh dương chính của Zalo

        // Màu nền chính
        'zalo-background': '#FFFFFF', // Trắng

        // Màu chữ chính
        'zalo-text': '#222222', // Màu chữ đậm

        // Màu chữ phụ
        'zalo-text-secondary': '#A1A1A1', // Mô tả, thời gian

        // Màu tin nhắn gửi đi
        'zalo-message-sent': '#E2EEFF', // Xanh nhạt

        // Màu tin nhắn nhận
        'zalo-message-received': '#F1F1F1', // Xám nhạt

        // Màu thông báo
        'zalo-notification': '#FF424F', // Đỏ cảnh báo

        // Màu liên kết
        'zalo-link': '#007AFF', // Xanh dương sáng
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
      require("tailwindcss-animate")
],
}

