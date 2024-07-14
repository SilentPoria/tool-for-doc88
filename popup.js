document.getElementById('confirm-button').addEventListener('click', function() {
    const startPage = document.getElementById('page-number-start').value;
    const endPage = document.getElementById('page-number-end').value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: downloadPages,
        args: [startPage, endPage]
      });
    });
  });
  
async function downloadPages(startPage, endPage) {
    const pagePromises = [];
    for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
        const canvasElement = document.getElementById(`page_${currentPage}`);
        if (!canvasElement) {
            console.warn(`未找到ID为 "page_${currentPage}" 的Canvas元素`);
            continue;
        }
        console.log(`开始处理第${currentPage}页`);
        const downloadPagePromise = new Promise((resolve) => {
            canvasElement.toBlob(blob => {
                if (!blob) {
                    resolve();
                    return;
                }
                const downloadLink = document.createElement('a');
                downloadLink.download = `page_${currentPage}.png`;
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.style.display = 'none';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(downloadLink.href);
                resolve();
            });
        });
        pagePromises.push(downloadPagePromise);
    }
    await Promise.all(pagePromises);
    console.log("所有页面已下载完毕");
}
