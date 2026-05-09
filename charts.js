// charts.js - Canvas based chart tools

class ChartTools {
    static drawLineChart(canvasId, data, labels, color) {
        const canvas = document.getElementById(canvasId);
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 200;

        const padding = 30;
        const maxData = Math.max(...data) * 1.2;
        const width = canvas.width - padding*2;
        const height = canvas.height - padding*2;

        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = '#eee';
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        const stepX = width / (data.length - 1);
        
        data.forEach((val, i) => {
            const x = padding + (i * stepX);
            const y = canvas.height - padding - ((val / maxData) * height);
            if(i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            
            // Draw points
             ctx.fillStyle = color;
             ctx.fillRect(x-3, y-3, 6, 6);
             // lbl
             ctx.fillStyle = '#666';
             ctx.font = '10px Inter';
             ctx.fillText(labels[i], x-10, canvas.height - 10);
        });
        ctx.stroke();
    }

    static drawDonutChart(canvasId, dataArr, colors, labels) {
        const canvas = document.getElementById(canvasId);
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 200;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2 - 40;
        const cy = canvas.height / 2;
        const radius = 60;
        
        let total = dataArr.reduce((a,b)=>a+b,0);
        let startAngle = 0;

        dataArr.forEach((val, i) => {
            const sliceAngle = (val / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.fillStyle = colors[i];
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
            ctx.fill();
            startAngle += sliceAngle;
            
            // Legend
            ctx.fillRect(cx + 80, cy - 40 + (i*20), 10, 10);
            ctx.fillStyle = '#666';
            ctx.font = '12px Inter';
            ctx.fillText(labels[i], cx + 95, cy - 30 + (i*20));
        });

        // Inner circle
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.arc(cx, cy, radius * 0.6, 0, 2*Math.PI);
        ctx.fill();
    }

    static drawGauge(canvasId, value, max, color) {
        const canvas = document.getElementById(canvasId);
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = 100;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width/2;
        const cy = canvas.height/2 + 20;
        const radius = 40;
        
        // bg arc
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI, 0);
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#eee';
        ctx.stroke();

        // val arc
        const endAngle = Math.PI + ((value/max) * Math.PI);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI, endAngle);
        ctx.lineWidth = 10;
        ctx.strokeStyle = color;
        ctx.stroke();

        ctx.fillStyle = '#333';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(value + '%', cx, cy - 10);
    }
}