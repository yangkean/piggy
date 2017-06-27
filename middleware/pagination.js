function showPagination(index, total) {
  let paginationStr = '';

  if(index <= 5 && total < 7) {
    for(let i = 1; i <= total; i++) {
      paginationStr += `<a class="piggy-normal-page ${(index === i) ? 'piggy-index' : ''}" href="/posts?page=${i}">${i}</a>`;
    }
  }

  if(index <= 5 && total >= 7) {
    for(let i = 1; i <= 5; i++) {
      paginationStr += `<a class="piggy-normal-page ${(index === i) ? 'piggy-index' : ''}" href="/posts?page=${i}">${i}</a>`;
    }

    paginationStr += `<a class="piggy-ellipsis">···</a><a class="piggy-normal-page" href="/posts?page=${total}">${total}</a>`;
  }

  if(index > 5 && index < total - 4) {
    paginationStr += '<a class="piggy-normal-page" href="/posts?page=1">1</a><a class="piggy-ellipsis">···</a>';

    for(let i = index - 2; i <= index + 2; i++) {
      paginationStr += `<a class="piggy-normal-page ${(index === i) ? 'piggy-index' : ''}" href="/posts?page=${i}">${i}</a>`;
    }

    paginationStr += `<a class="piggy-ellipsis">···</a><a class="piggy-normal-page" href="/posts?page=${total}">${total}</a>`;
  }

  if(index > 5 && index >= total - 4) {
    paginationStr += '<a class="piggy-normal-page" href="/posts?page=1">1</a><a class="piggy-ellipsis">···</a>';

    for(let i = total - 4; i <= total; i++) {
      paginationStr += `<a class="piggy-normal-page ${(index === i) ? 'piggy-index' : ''}" href="/posts?page=${i}">${i}</a>`;
    }
  }

  paginationStr = `<a class="piggy-last-page" href="javascript:;">上一页</a>${paginationStr}<a class="piggy-next-page" href="javascript:;">下一页</a>`;

  return paginationStr;
}

exports = module.exports = showPagination;
