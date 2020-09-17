$(function(){
  $("#addField").click(function(){
    let lastNubmer = $("tr").last().children().first().text();
    let nextNumber = parseInt(lastNubmer, 10) + 1
    let html = `<tr> \
                  <td>${nextNumber}</td> \
                  <td><input name="key-${nextNumber}"></td> \
                  <td><input name="value-${nextNumber}"></td> \
                  <td><button type="button" class="remove btn btn-primary">移除欄位</button></td>
                </tr>`;
    $("tbody").append(html);
    removeButtonClickEvent();
  });
  $("#replace").click(function(){
    let lastNubmer = $("tr").last().children().first().text();
    let targetStr = $("textarea[name=content]").val();
    let key, value;
    let re;
    
    lastNubmer = parseInt(lastNubmer, 10)
    for(var i = 0; i <= lastNubmer; i++){
      key = $(`input[name=key-${i}]`).val();
      value = $(`input[name=value-${i}]`).val();
      re = new RegExp(key, "g");
      targetStr = targetStr.replace(re, value);
    }
    $("textarea[name=content]").val(targetStr)
  });
  function removeButtonClickEvent(){
    $(".remove").unbind();
    $(".remove").click(function(){
      let currentNumber = $(("td"), $(this).parent().parent()).first().text();
      let lastNubmer = $("tr").last().children().first().text();
      currentNumber = parseInt(currentNumber, 10);
      lastNubmer = parseInt(lastNubmer, 10);
      if(lastNubmer != 0){
        $(this).parent().parent().remove();
        for(let i = currentNumber + 1; i <= lastNubmer; i++){
          let previousNumber = i - 1;
          $(`input[name=key-${i}]`).parent().parent().children().first().text(previousNumber);
          $(`input[name=key-${i}]`).attr("name", `key-${previousNumber}`);
          $(`input[name=value-${i}]`).attr("name", `value-${previousNumber}`);
        }
      }
    });
  };
  removeButtonClickEvent();
  $("#copy").click(function(){
    var copyText = document.querySelector("#content");
    copyText.select();
    document.execCommand("copy");
  });
  $("#clear").click(function(){
    $("#content").val('');
  });
});