// async function downloadPages(startPage, endPage) {
//     const pagePromises = [];
//     for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
//         const canvasElement = document.getElementById(`page_${currentPage}`);
//         if (!canvasElement) {
//             console.warn(`未找到ID为 "page_${currentPage}" 的Canvas元素`);
//             continue;
//         }
//         console.log(`开始处理第${currentPage}页`);
//         const downloadPagePromise = new Promise((resolve) => {
//             canvasElement.toBlob(blob => {
//                 if (!blob) {
//                     resolve();
//                     return;
//                 }
//                 const downloadLink = document.createElement('a');
//                 downloadLink.download = `page_${currentPage}.png`;
//                 downloadLink.href = URL.createObjectURL(blob);
//                 downloadLink.style.display = 'none';
//                 document.body.appendChild(downloadLink);
//                 downloadLink.click();
//                 document.body.removeChild(downloadLink);
//                 URL.revokeObjectURL(downloadLink.href);
//                 resolve();
//             });
//         });
//         pagePromises.push(downloadPagePromise);
//     }
//     await Promise.all(pagePromises);
//     console.log("所有页面已下载完毕");
// }


async function downloadPagesAsPdf(startPage, endPage) {
    const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
        const canvasId = `page_${currentPage}`;
        const canvasElement = document.getElementById(canvasId);
        if (!canvasElement) {
            console.warn(`未找到ID为 "${canvasId}" 的Canvas元素`);
            continue;
        }
        console.log(`开始处理第${currentPage}页`);

        // 将canvas转换为Base64格式的图片
        const imgData = canvasElement.toDataURL('image/png');

        // 将图片添加到PDF
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

        // 每处理完一页，添加分页符
        if (currentPage < endPage) {
            pdf.addPage();
        }
    }

    // 保存PDF文件
    pdf.save('merged_pages.pdf');
    console.log("所有页面已合并为PDF并保存");
}