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
  $("#export").click(function(){
    //得到最後的編號
    let lastNubmer = $("tr").last().children().first().text();
    let key, value;
    let ExportedObject = [];
    lastNubmer = parseInt(lastNubmer, 10)
    //做成陣列包物件
    for(var i = 0; i <= lastNubmer; i++){
      key = $(`input[name=key-${i}]`).val();
      value = $(`input[name=value-${i}]`).val();
      ExportedObject[i] = {};
      ExportedObject[i][`key-${i}`] = key;
      ExportedObject[i][`value-${i}`] = value;
    }

    var Now = new Date();
    var NowString;
    NowString = Now.getFullYear() + ('0' + (Now.getMonth()+1)).slice(-2) + ('0' + Now.getDate()).slice(-2) + "_" + ('0' + (Now.getHours())).slice(-2) + ('0' + (Now.getMinutes())).slice(-2) + ('0' + (Now.getSeconds())).slice(-2);
    //以表格標題為檔名一部份
    let filename = $('#tableTitle').text() + "_" + NowString;
    //物件轉為json字串
    let text = new Blob([JSON.stringify(ExportedObject)], {type : 'application/json'});
    //下載
    const a = document.createElement("a")
    const url = window.URL.createObjectURL(text)
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  });
  $("#import").change(function(){
    if(this.files.length == 1){
      let re = new RegExp(".*(?=_[0-9]*_[0-9]+\.json)");
      let filename = this.files[0].name; //檔名為 "表格標題"_"存檔日期"_"存檔時間".json
      let tableTitle = (filename.match(re))[0]; //爬出 表格標題
      let reader = new FileReader();
      
      $('#tableTitle').text(tableTitle);
      reader.readAsText(this.files[0],'UTF-8');
      reader.onload = function () {
        let key_value = JSON.parse(this.result);
        let len = key_value.length;
        $("tbody tr").remove();
        //依據匯入的檔案做出表格
        for(let i = 0; i < len; i++){
          let key = key_value[i][`key-${i}`];
          let value = key_value[i][`value-${i}`];
          console.log(key, value)
          let html = `<tr> \
                        <td>${i}</td> \
                        <td><input name="key-${i}" value="${key}"></td> \
                        <td><input name="value-${i}" value="${value}"></td> \
                        <td><button type="button" class="remove btn btn-primary">移除欄位</button></td>
                      </tr>`;
          $("tbody").append(html);
        }
        //註冊所有"移除欄位"按鈕事件
        removeButtonClickEvent()
      };
      //處理完的文件要刪除，否則再import一次同樣的檔案不會觸發input[type=file]的change事件
      document.getElementById('import').value = "";
    };
  });
});