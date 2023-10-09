function detectFile(){
  const inputElement = document.querySelector('.fileinput')
  const files = inputElement.files
  const file = files[0]
  const fileReader = new FileReader()
  fileReader.addEventListener('load', function(){
    const fileContent = fileReader.result //非同期であるため、リターンできない
    parseFile(file.name, fileContent)
  })
  fileReader.readAsText(file)
}

function parseFile(fileName, fileContent){
  const dataGroups = createDataGroups()
  const [ppsName] = fileName.match(/(?<=請求_).+?(?=-\d{4})/)
  const useData = parseCsvUsePapa(fileContent)
  setRenewableCostPrice(useData)
  // sumTotalUse(useData)
  // countInvoice(useData)
  // sumTotalPriceWithoutTax(useData)
  groupingData(dataGroups, useData)
  const reportMonth = getReportMonth(useData)
  const totalUseDen = sumTotalUseDen(dataGroups)
  const totalUseDou = sumTotalUseDo(dataGroups)
  const invoiceDenCount = countInvoiceDen(dataGroups)
  const invoiceDouCount = countInvoiceDo(dataGroups)
  const sumTotalPriceDen = sumTotalPriceWithoutTaxDen(dataGroups)
  const sumTotalPriceDou = sumTotalPriceWithoutTaxDo(dataGroups)
  const classTotal = classTo(totalUseDen, totalUseDou, invoiceDenCount, invoiceDouCount, sumTotalPriceDen, sumTotalPriceDou)
  //console.dir(dataGroups, {depth:null})
  writeResultCsv(
    ppsName,
    reportMonth,totalUseDen, totalUseDou, invoiceDenCount, invoiceDouCount, sumTotalPriceDen, sumTotalPriceDou,classTotal)
}

function parseCsvUsePapa(csvFileContent){
  const parsed = Papa.parse(csvFileContent,{header:true, dynamicTyping: true})
  return parsed.data
}

// 実行時間のひと月前を「対象月」とする
// csvの「to」の列が対象月のものだけに絞る。
//A 1行毎、電気料金に対して再エネ賦課金をマイナスし税抜き金額として算出する。
// 各電力会社毎(エリア別)と、電力種別に分類する(grouping)
function createDataGroups(){
  return {
    dento:{
    '北海道':[],
    '東北':[],
    '東京':[],
    '中部':[],
    '北陸':[],
    '関西':[],
    '中国':[],
    '四国':[],
    '九州':[],
    },
  doryoku:{
    '北海道':[],
    '東北':[],
    '東京':[],
    '中部':[],
    '北陸':[],
    '関西':[],
    '中国':[],
    '四国':[],
    '九州':[],
    }
  }
}

function groupingData(dataGroups, csvData){
  csvData.forEach(function(lineData){
    if(lineData.供給種別 == '電灯'){
      dataGroups.dento[lineData.エリア].push(lineData)
    }
    if(lineData.供給種別 == '動力'){
      dataGroups.doryoku[lineData.エリア].push(lineData)
    }
  })
}

function getReportMonth(csvData){
  const reportMonth = csvData[0].To
  return reportMonth
}

//   分類ごとに「A」で算出した金額の合算した値、使用電力量を合算した値、請求件数,各分類の合計を出す
function sumTotalUseDen(dataGroups){
  let totalUseDHok = 0
  dataGroups.dento["北海道"].forEach(function(lineData){
    totalUseDHok += lineData.総電力使用量
  })
  let totalUseDToH = 0
  dataGroups.dento["東北"].forEach(function(lineData){
    totalUseDToH += lineData.総電力使用量
  })
  let totalUseDToK = 0
  dataGroups.dento["東京"].forEach(function(lineData){
    totalUseDToK += lineData.総電力使用量
  })
  let totalUseDChuB = 0
  dataGroups.dento["中部"].forEach(function(lineData){
    totalUseDChuB += lineData.総電力使用量
  })
  let totalUseDHokRi = 0
  dataGroups.dento["北陸"].forEach(function(lineData){
    totalUseDHokRi += lineData.総電力使用量
  })
  let totalUseDKan = 0
  dataGroups.dento["関西"].forEach(function(lineData){
    totalUseDKan += lineData.総電力使用量
  })
  let totalUseDChuK = 0
  dataGroups.dento["中国"].forEach(function(lineData){
    totalUseDChuK += lineData.総電力使用量
  })
  let totalUseDSi = 0
  dataGroups.dento["四国"].forEach(function(lineData){
    totalUseDSi += lineData.総電力使用量
  })
  let totalUseDKyu = 0
  dataGroups.dento["九州"].forEach(function(lineData){
    totalUseDKyu += lineData.総電力使用量
  })
  console.log("電灯総使用量")
  console.log(totalUseDHok,totalUseDToH,totalUseDToK,totalUseDChuB,totalUseDHokRi,totalUseDKan,totalUseDChuK,totalUseDSi,totalUseDKyu)
  const totalUseD = [
    totalUseDHok,
    totalUseDToH,
    totalUseDToK,
    totalUseDChuB,
    totalUseDHokRi,
    totalUseDKan,
    totalUseDChuK,
    totalUseDSi,
    totalUseDKyu
  ]
  return totalUseD
}

function sumTotalUseDo(dataGroups){
  let totalUseDRHok = 0
  dataGroups.doryoku["北海道"].forEach(function(lineData){
    totalUseDRHok += lineData.総電力使用量
  })
  let totalUseDRToH = 0
  dataGroups.doryoku["東北"].forEach(function(lineData){
    totalUseDRToH += lineData.総電力使用量
  })
  let totalUseDRToK = 0
  dataGroups.doryoku["東京"].forEach(function(lineData){
    totalUseDRToK += lineData.総電力使用量
  })
  let totalUseDRChuB = 0
  dataGroups.doryoku["中部"].forEach(function(lineData){
    totalUseDRChuB += lineData.総電力使用量
  })
  let totalUseDRHokRi = 0
  dataGroups.doryoku["北陸"].forEach(function(lineData){
    totalUseDRHokRi += lineData.総電力使用量
  })
  let totalUseDRKan = 0
  dataGroups.doryoku["関西"].forEach(function(lineData){
    totalUseDRKan += lineData.総電力使用量
  })
  let totalUseDRChuK = 0
  dataGroups.doryoku["中国"].forEach(function(lineData){
    totalUseDRChuK += lineData.総電力使用量
  })
  let totalUseDRSi = 0
  dataGroups.doryoku["四国"].forEach(function(lineData){
    totalUseDRSi += lineData.総電力使用量
  })
  let totalUseDRKyu = 0
  dataGroups.doryoku["九州"].forEach(function(lineData){
    totalUseDRKyu += lineData.総電力使用量
  })
  console.log("動力総使用量")
  console.log(totalUseDRHok,totalUseDRToH,totalUseDRToK,totalUseDRChuB,totalUseDRHokRi,totalUseDRKan,totalUseDRChuK,totalUseDRSi,totalUseDRKyu)
  const totalUseDr = [
    totalUseDRHok,
    totalUseDRToH,
    totalUseDRToK,
    totalUseDRChuB,
    totalUseDRHokRi,
    totalUseDRKan,
    totalUseDRChuK,
    totalUseDRSi,
    totalUseDRKyu
  ]
  return totalUseDr
}

function countInvoiceDen(dataGroups){
  console.log("電力の総数")
  console.log(dataGroups.dento["北海道"].length,dataGroups.dento["東北"].length,dataGroups.dento["東京"].length,dataGroups.dento["中部"].length,dataGroups.dento["北陸"].length,dataGroups.dento["関西"].length,dataGroups.dento["中国"].length,dataGroups.dento["四国"].length,dataGroups.dento["九州"].length)
  const countInvoiceDe = [
    dataGroups.dento["北海道"].length,
    dataGroups.dento["東北"].length,
    dataGroups.dento["東京"].length,
    dataGroups.dento["中部"].length,
    dataGroups.dento["北陸"].length,
    dataGroups.dento["関西"].length,
    dataGroups.dento["中国"].length,
    dataGroups.dento["四国"].length,
    dataGroups.dento["九州"].length]
  return countInvoiceDe
}

function countInvoiceDo(dataGroups){
  console.log("動力の総数")
  console.log(dataGroups.doryoku["北海道"].length,dataGroups.doryoku["東北"].length,dataGroups.doryoku["東京"].length,dataGroups.doryoku["中部"].length,dataGroups.doryoku["北陸"].length,dataGroups.doryoku["関西"].length,dataGroups.doryoku["中国"].length,dataGroups.doryoku["四国"].length,dataGroups.doryoku["九州"].length)
  const countInvoiceDou = [
    dataGroups.doryoku["北海道"].length,
    dataGroups.doryoku["東北"].length,
    dataGroups.doryoku["東京"].length,
    dataGroups.doryoku["中部"].length,
    dataGroups.doryoku["北陸"].length,
    dataGroups.doryoku["関西"].length,
    dataGroups.doryoku["中国"].length,
    dataGroups.doryoku["四国"].length,
    dataGroups.doryoku["九州"].length]
  return countInvoiceDou
}

function sumTotalPriceWithoutTaxDen(dataGroups){
  let totalUseDHok = 0
  dataGroups.dento["北海道"].forEach(function(lineData){
    totalUseDHok += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDToH = 0
  dataGroups.dento["東北"].forEach(function(lineData){
    totalUseDToH += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDToK = 0
  dataGroups.dento["東京"].forEach(function(lineData){
    totalUseDToK += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDChuB = 0
  dataGroups.dento["中部"].forEach(function(lineData){
    totalUseDChuB += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDHokRi = 0
  dataGroups.dento["北陸"].forEach(function(lineData){
    totalUseDHokRi += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDKan = 0
  dataGroups.dento["関西"].forEach(function(lineData){
    totalUseDKan += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDChuK = 0
  dataGroups.dento["中国"].forEach(function(lineData){
    totalUseDChuK += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDSi = 0
  dataGroups.dento["四国"].forEach(function(lineData){
    totalUseDSi += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDKyu = 0
  dataGroups.dento["九州"].forEach(function(lineData){
    totalUseDKyu += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  console.log("電力の税別請求金額")
  console.log(Math.round(totalUseDHok),Math.round(totalUseDToH),Math.round(totalUseDToK),Math.round(totalUseDChuB),Math.round(totalUseDHokRi),Math.round(totalUseDKan),Math.round(totalUseDChuK),Math.round(totalUseDSi),Math.round(totalUseDKyu))
  const totalPriceDen = [
    Math.round(totalUseDHok),
    Math.round(totalUseDToH),
    Math.round(totalUseDToK),
    Math.round(totalUseDChuB),
    Math.round(totalUseDHokRi),
    Math.round(totalUseDKan),
    Math.round(totalUseDChuK),
    Math.round(totalUseDSi),
    Math.round(totalUseDKyu)]
  return totalPriceDen
}

function sumTotalPriceWithoutTaxDo(dataGroups){
  let totalUseDRHok = 0
  dataGroups.doryoku["北海道"].forEach(function(lineData){
    totalUseDRHok += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDRToH = 0
  dataGroups.doryoku["東北"].forEach(function(lineData){
    totalUseDRToH += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDRToK = 0
  dataGroups.doryoku["東京"].forEach(function(lineData){
    totalUseDRToK += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDRChuB = 0
  dataGroups.doryoku["中部"].forEach(function(lineData){
    totalUseDRChuB += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDRHokRi = 0
  dataGroups.doryoku["北陸"].forEach(function(lineData){
    totalUseDRHokRi += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDRKan = 0
  dataGroups.doryoku["関西"].forEach(function(lineData){
    totalUseDRKan += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDRChuK = 0
  dataGroups.doryoku["中国"].forEach(function(lineData){
    totalUseDRChuK += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDRSi = 0
  dataGroups.doryoku["四国"].forEach(function(lineData){
    totalUseDRSi += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  let totalUseDRKyu = 0
  dataGroups.doryoku["九州"].forEach(function(lineData){
    totalUseDRKyu += (lineData.請求金額-lineData.再エネ賦課金_金額)/1.1
  })
  console.log("動力の税別請求金額")
  console.log(Math.round(totalUseDRHok),Math.round(totalUseDRToH),Math.round(totalUseDRToK),Math.round(totalUseDRChuB),Math.round(totalUseDRHokRi),Math.round(totalUseDRKan),Math.round(totalUseDRChuK),Math.round(totalUseDRSi),Math.round(totalUseDRKyu))
  const totalPriceDou = [
    Math.round(totalUseDRHok),
    Math.round(totalUseDRToH),
    Math.round(totalUseDRToK),
    Math.round(totalUseDRChuB),
    Math.round(totalUseDRHokRi),
    Math.round(totalUseDRKan),
    Math.round(totalUseDRChuK),
    Math.round(totalUseDRSi),
    Math.round(totalUseDRKyu)]
  return totalPriceDou
}

function classTo(totalUseDen, totalUseDou, invoiceDenCount, invoiceDouCount, sumTotalPriceDen, sumTotalPriceDou){
  let totalUseD = 0
  totalUseDen.forEach(function(lineData){
    totalUseD += Math.round(lineData / 1000)
  })
  let totalUseDo = 0
  totalUseDou.forEach(function(lineData){
    totalUseDo += Math.round(lineData / 1000)
  })
  let invoiceD = 0
  invoiceDenCount.forEach(function(lineData){
    invoiceD += lineData
  })
  let invoiceDo = 0
  invoiceDouCount.forEach(function(lineData){
    invoiceDo += lineData
  })
  let sumTotalPriceD = 0
  sumTotalPriceDen.forEach(function(lineData){
    sumTotalPriceD += Math.round(lineData / 1000)
  })
  let sumTotalPriceDo = 0
  sumTotalPriceDou.forEach(function(lineData){
    sumTotalPriceDo += Math.round(lineData / 1000)
  })
  console.log("各分類の合計")
  console.log(totalUseD,sumTotalPriceD,invoiceD,totalUseDo,sumTotalPriceDo,invoiceDo)
  const classTotal = [
    totalUseD,
    sumTotalPriceD,
    invoiceD,
    totalUseDo,
    sumTotalPriceDo,
    invoiceDo
    ]
  return classTotal
}
//「{YYYYMM}_様式第11表1表_{PPS名}.csv」出力用ファイルのフォーマットに各値を埋め込み、outputディレクトリに書き出す。

function writeResultCsv(
  ppsName,
  reportMonth,totalUseDen, totalUseDou, invoiceDenCount, invoiceDouCount, sumTotalPriceDen, sumTotalPriceDou,classTotal){
  const templateCsvContent = getCsvTemplate()
  const todayString = dayjs().format('YYYY年　M月　D日')
  let csvContent = templateCsvContent.replace("{{CRETED_DATE}}", todayString)
  csvContent = csvContent.replace("{{PPS_NAME}}", ppsName)
  const reportMonthStr = dayjs(reportMonth).format('YYYY年　M月分')
  csvContent = csvContent.replace("{{REPORT_MONTH}}", reportMonthStr)

  let totalUseDen0 = totalUseDen[0]
  if(totalUseDen0 === 0){
    totalUseDen0 = ""
  }else if((Math.round(totalUseDen0 / 1000) < 1)){
    totalUseDen0 = "α"
  }else{
    totalUseDen0 = Math.round(totalUseDen0 / 1000)
  }
  let totalUseDen1 = totalUseDen[1]
  if(totalUseDen1 === 0){
    totalUseDen1 = ""
  }else if((Math.round(totalUseDen1 / 1000) < 1)){
    totalUseDen1 = "α"
  }else{
    totalUseDen1 = Math.round(totalUseDen1 / 1000)
  }
  let totalUseDen2 = totalUseDen[2]
  if(totalUseDen2 === 0){
    totalUseDen2 = ""
  }else if((Math.round(totalUseDen2 / 1000) < 1)){
    totalUseDen2 = "α"
  }else{
    totalUseDen2 = Math.round(totalUseDen2 / 1000)
  }
  let totalUseDen3 = totalUseDen[3]
  if(totalUseDen3 === 0){
    totalUseDen3 = ""
  }else if((Math.round(totalUseDen3 / 1000) < 1)){
    totalUseDen3 = "α"
  }else{
    totalUseDen3 = Math.round(totalUseDen3 / 1000)
  }
  let totalUseDen4 = totalUseDen[4]
  if(totalUseDen4 === 0){
    totalUseDen4 = ""
  }else if((Math.round(totalUseDen4 / 1000) < 1)){
    totalUseDen4 = "α"
  }else{
    totalUseDen4 = Math.round(totalUseDen4 / 1000)
  }
  let totalUseDen5 = totalUseDen[5]
  if(totalUseDen5 === 0){
    totalUseDen5 = ""
  }else if((Math.round(totalUseDen5 / 1000) < 1)){
    totalUseDen5 = "α"
  }else{
    totalUseDen5 = Math.round(totalUseDen5 / 1000)
  }
  let totalUseDen6 = totalUseDen[6]
  if(totalUseDen6 === 0){
    totalUseDen6 = ""
  }else if((Math.round(totalUseDen6 / 1000) < 1)){
    totalUseDen6 = "α"
  }else{
    totalUseDen6 = Math.round(totalUseDen6 / 1000)
  }
  let totalUseDen7 = totalUseDen[7]
  if(totalUseDen7 === 0){
    totalUseDen7 = ""
  }else if((Math.round(totalUseDen7 / 1000) < 1)){
    totalUseDen7 = "α"
  }else{
    totalUseDen7 = Math.round(totalUseDen7 / 1000)
  }
  let totalUseDen8 = totalUseDen[8]
  if(totalUseDen8 === 0){
    totalUseDen8 = ""
  }else if((Math.round(totalUseDen8 / 1000) < 1)){
    totalUseDen8 = "α"
  }else{
    totalUseDen8 = Math.round(totalUseDen8 / 1000)
  }

  let sumTotalPriceDen0 = sumTotalPriceDen[0]
  if(sumTotalPriceDen0 === 0){
    sumTotalPriceDen0 = ""
  }else if((Math.round(sumTotalPriceDen0 / 1000) < 1)){
    sumTotalPriceDen0 = "α"
  }else{
    sumTotalPriceDen0 = Math.round(sumTotalPriceDen0 / 1000)
  }
  let sumTotalPriceDen1 = sumTotalPriceDen[1]
  if(sumTotalPriceDen1 === 0){
    sumTotalPriceDen1 = ""
  }else if((Math.round(sumTotalPriceDen1 / 1000) < 1)){
    sumTotalPriceDen1 = "α"
  }else{
    sumTotalPriceDen1 = Math.round(sumTotalPriceDen1 / 1000)
  }
  let sumTotalPriceDen2 = sumTotalPriceDen[2]
  if(sumTotalPriceDen2 === 0){
    sumTotalPriceDen2 = ""
  }else if((Math.round(sumTotalPriceDen2 / 1000) < 1)){
    sumTotalPriceDen2 = "α"
  }else{
    sumTotalPriceDen2 = Math.round(sumTotalPriceDen2 / 1000)
  }
  let sumTotalPriceDen3 = sumTotalPriceDen[3]
  if(sumTotalPriceDen3 === 0){
    sumTotalPriceDen3 = ""
  }else if((Math.round(sumTotalPriceDen3 / 1000) < 1)){
    sumTotalPriceDen3 = "α"
  }else{
    sumTotalPriceDen3 = Math.round(sumTotalPriceDen3 / 1000)
  }
  let sumTotalPriceDen4 = sumTotalPriceDen[4]
  if(sumTotalPriceDen4 === 0){
    sumTotalPriceDen4 = ""
  }else if((Math.round(sumTotalPriceDen4 / 1000) < 1)){
    sumTotalPriceDen4 = "α"
  }else{
    sumTotalPriceDen4 = Math.round(sumTotalPriceDen4 / 1000)
  }
  let sumTotalPriceDen5 = sumTotalPriceDen[5]
  if(sumTotalPriceDen5 === 0){
    sumTotalPriceDen5 = ""
  }else if((Math.round(sumTotalPriceDen5 / 1000) < 1)){
    sumTotalPriceDen5 = "α"
  }else{
    sumTotalPriceDen5 = Math.round(sumTotalPriceDen5 / 1000)
  }
  let sumTotalPriceDen6 = sumTotalPriceDen[6]
  if(sumTotalPriceDen6 === 0){
    sumTotalPriceDen6 = ""
  }else if((Math.round(sumTotalPriceDen6 / 1000) < 1)){
    sumTotalPriceDen6 = "α"
  }else{
    sumTotalPriceDen6 = Math.round(sumTotalPriceDen6 / 1000)
  }
  let sumTotalPriceDen7 = sumTotalPriceDen[7]
  if(sumTotalPriceDen7 === 0){
    sumTotalPriceDen7 = ""
  }else if((Math.round(sumTotalPriceDen7 / 1000) < 1)){
    sumTotalPriceDen7 = "α"
  }else{
    sumTotalPriceDen7 = Math.round(sumTotalPriceDen7 / 1000)
  }
  let sumTotalPriceDen8 = sumTotalPriceDen[8]
  if(sumTotalPriceDen8 === 0){
    sumTotalPriceDen8 = ""
  }else if((Math.round(sumTotalPriceDen8 / 1000) < 1)){
    sumTotalPriceDen8 = "α"
  }else{
    sumTotalPriceDen8 = Math.round(sumTotalPriceDen8 / 1000)
  }

  let invoiceDenCount0 = invoiceDenCount[0]
  if(invoiceDenCount0 === 0){
    invoiceDenCount0 = ""
  }else{
    invoiceDenCount0
  }
  let invoiceDenCount1 = invoiceDenCount[1]
  if(invoiceDenCount1 === 0){
    invoiceDenCount1 = ""
  }else{
    invoiceDenCount1
  }
  let invoiceDenCount2 = invoiceDenCount[2]
  if(invoiceDenCount2 === 0){
    invoiceDenCount2 = ""
  }else{
    invoiceDenCount2
  }
  let invoiceDenCount3 = invoiceDenCount[3]
  if(invoiceDenCount3 === 0){
    invoiceDenCount3 = ""
  }else{
    invoiceDenCount3
  }
  let invoiceDenCount4 = invoiceDenCount[4]
  if(invoiceDenCount4 === 0){
    invoiceDenCount4 = ""
  }else{
    invoiceDenCount4
  }
  let invoiceDenCount5 = invoiceDenCount[5]
  if(invoiceDenCount5 === 0){
    invoiceDenCount5 = ""
  }else{
    invoiceDenCount5
  }
  let invoiceDenCount6 = invoiceDenCount[6]
  if(invoiceDenCount6 === 0){
    invoiceDenCount6 = ""
  }else{
    invoiceDenCount6
  }
  let invoiceDenCount7 = invoiceDenCount[7]
  if(invoiceDenCount7 === 0){
    invoiceDenCount7 = ""
  }else{
    invoiceDenCount7
  }
  let invoiceDenCount8 = invoiceDenCount[8]
  if(invoiceDenCount8 === 0){
    invoiceDenCount8 = ""
  }else{
    invoiceDenCount8
  }

  let totalUseDou0 = totalUseDou[0]
  if(totalUseDou0 === 0){
    totalUseDou0 = ""
  }else if((Math.round(totalUseDou0 / 1000) < 1)){
    totalUseDou0 = "α"
  }else{
    totalUseDou0 = Math.round(totalUseDou0 / 1000)
  }
  let totalUseDou1 = totalUseDou[1]
  if(totalUseDou1 === 0){
    totalUseDou1 = ""
  }else if((Math.round(totalUseDou1 / 1000) < 1)){
    totalUseDou1 = "α"
  }else{
    totalUseDou1 = Math.round(totalUseDou1 / 1000)
  }
  let totalUseDou2 = totalUseDou[2]
  if(totalUseDou2 === 0){
    totalUseDou2 = ""
  }else if((Math.round(totalUseDou2 / 1000) < 1)){
    totalUseDou2 = "α"
  }else{
    totalUseDou2 = Math.round(totalUseDou2 / 1000)
  }
  let totalUseDou3 = totalUseDou[3]
  if(totalUseDou3 === 0){
    totalUseDou3 = ""
  }else if((Math.round(totalUseDou3 / 1000) < 1)){
    totalUseDou3 = "α"
  }else{
    totalUseDou3 = Math.round(totalUseDou3 / 1000)
  }
  let totalUseDou4 = totalUseDou[4]
  if(totalUseDou4 === 0){
    totalUseDou4 = ""
  }else if((Math.round(totalUseDou4 / 1000) < 1)){
    totalUseDou4 = "α"
  }else{
    totalUseDou4 = Math.round(totalUseDou4 / 1000)
  }
  let totalUseDou5 = totalUseDou[5]
  if(totalUseDou5 === 0){
    totalUseDou5 = ""
  }else if((Math.round(totalUseDou5 / 1000) < 1)){
    totalUseDou5 = "α"
  }else{
    totalUseDou5 = Math.round(totalUseDou5 / 1000)
  }
  let totalUseDou6 = totalUseDou[6]
  if(totalUseDou6 === 0){
    totalUseDou6 = ""
  }else if((Math.round(totalUseDou6 / 1000) < 1)){
    totalUseDou6 = "α"
  }else{
    totalUseDou6 = Math.round(totalUseDou6 / 1000)
  }
  let totalUseDou7 = totalUseDou[7]
  if(totalUseDou7 === 0){
    totalUseDou7 = ""
  }else if((Math.round(totalUseDou7 / 1000) < 1)){
    totalUseDou7 = "α"
  }else{
    totalUseDou7 = Math.round(totalUseDou7 / 1000)
  }
  let totalUseDou8 = totalUseDou[8]
  if(totalUseDou8 === 0){
    totalUseDou8 = ""
  }else if((Math.round(totalUseDou8 / 1000) < 1)){
    totalUseDou8 = "α"
  }else{
    totalUseDou8 = Math.round(totalUseDou8 / 1000)
  }

  let sumTotalPriceDou0 = sumTotalPriceDou[0]
  if(sumTotalPriceDou0 === 0){
    sumTotalPriceDou0 = ""
  }else if((Math.round(sumTotalPriceDou0 / 1000) < 1)){
    sumTotalPriceDou0 = "α"
  }else{
    sumTotalPriceDou0 = Math.round(sumTotalPriceDou0 / 1000)
  }
  let sumTotalPriceDou1 = sumTotalPriceDou[1]
  if(sumTotalPriceDou1 === 0){
    sumTotalPriceDou1 = ""
  }else if((Math.round(sumTotalPriceDou1 / 1000) < 1)){
    sumTotalPriceDou1 = "α"
  }else{
    sumTotalPriceDou1 = Math.round(sumTotalPriceDou1 / 1000)
  }
  let sumTotalPriceDou2 = sumTotalPriceDou[2]
  if(sumTotalPriceDou2 === 0){
    sumTotalPriceDou2 = ""
  }else if((Math.round(sumTotalPriceDou2 / 1000) < 1)){
    sumTotalPriceDou2 = "α"
  }else{
    sumTotalPriceDou2 = Math.round(sumTotalPriceDou2 / 1000)
  }
  let sumTotalPriceDou3 = sumTotalPriceDou[3]
  if(sumTotalPriceDou3 === 0){
    sumTotalPriceDou3 = ""
  }else if((Math.round(sumTotalPriceDou3 / 1000) < 1)){
    sumTotalPriceDou3 = "α"
  }else{
    sumTotalPriceDou3 = Math.round(sumTotalPriceDou3 / 1000)
  }
  let sumTotalPriceDou4 = sumTotalPriceDou[4]
  if(sumTotalPriceDou4 === 0){
    sumTotalPriceDou4 = ""
  }else if((Math.round(sumTotalPriceDou4 / 1000) < 1)){
    sumTotalPriceDou4 = "α"
  }else{
    sumTotalPriceDou4 = Math.round(sumTotalPriceDou4 / 1000)
  }
  let sumTotalPriceDou5 = sumTotalPriceDou[5]
  if(sumTotalPriceDou5 === 0){
    sumTotalPriceDou5 = ""
  }else if((Math.round(sumTotalPriceDou5 / 1000) < 1)){
    sumTotalPriceDou5 = "α"
  }else{
    sumTotalPriceDou5 = Math.round(sumTotalPriceDou5 / 1000)
  }
  let sumTotalPriceDou6 = sumTotalPriceDou[6]
  if(sumTotalPriceDou6 === 0){
    sumTotalPriceDou6 = ""
  }else if(Math.round((sumTotalPriceDou6 / 1000) < 1)){
    sumTotalPriceDou6 = "α"
  }else{
    sumTotalPriceDou6 = Math.round(sumTotalPriceDou6 / 1000)
  }
  let sumTotalPriceDou7 = sumTotalPriceDou[7]
  if(sumTotalPriceDou7 === 0){
    sumTotalPriceDou7 = ""
  }else if((Math.round(sumTotalPriceDou7 / 1000) < 1)){
    sumTotalPriceDou7 = "α"
  }else{
    sumTotalPriceDou7 = Math.round(sumTotalPriceDou7 / 1000)
  }
  let sumTotalPriceDou8 = sumTotalPriceDou[8]
  if(sumTotalPriceDou8 === 0){
    sumTotalPriceDou8 = ""
  }else if((Math.round(sumTotalPriceDou8 / 1000) < 1)){
    sumTotalPriceDou8 = "α"
  }else{
    sumTotalPriceDou8 = Math.round(sumTotalPriceDou8 / 1000)
  }

  let invoiceDouCount0 = invoiceDouCount[0]
  if(invoiceDouCount0 === 0){
    invoiceDouCount0 = ""
  }else{
    invoiceDouCount0
  }
  let invoiceDouCount1 = invoiceDouCount[1]
  if(invoiceDouCount1 === 0){
    invoiceDouCount1 = ""
  }else{
    invoiceDouCount1
  }
  let invoiceDouCount2 = invoiceDouCount[2]
  if(invoiceDouCount2 === 0){
    invoiceDouCount2 = ""
  }else{
    invoiceDouCount2
  }
  let invoiceDouCount3 = invoiceDouCount[3]
  if(invoiceDouCount3 === 0){
    invoiceDouCount3 = ""
  }else{
    invoiceDouCount3
  }
  let invoiceDouCount4 = invoiceDouCount[4]
  if(invoiceDouCount4 === 0){
    invoiceDouCount4 = ""
  }else{
    invoiceDouCount4
  }
  let invoiceDouCount5 = invoiceDouCount[5]
  if(invoiceDouCount5 === 0){
    invoiceDouCount5 = ""
  }else{
    invoiceDouCount5
  }
  let invoiceDouCount6 = invoiceDouCount[6]
  if(invoiceDouCount6 === 0){
    invoiceDouCount6 = ""
  }else{
    invoiceDouCount6
  }
  let invoiceDouCount7 = invoiceDouCount[7]
  if(invoiceDouCount7 === 0){
    invoiceDouCount7 = ""
  }else{
    invoiceDouCount7
  }
  let invoiceDouCount8 = invoiceDouCount[8]
  if(invoiceDouCount8 === 0){
    invoiceDouCount8 = ""
  }else{
    invoiceDouCount8
  }

  let classTotal0 = classTotal[0]
  if(classTotal0 === 0){
    classTotal0 = ""
  }else if(classTotal0 < 1){
    classTotal0 = "α"
  }else{
    classTotal0 = classTotal0
  }
  let classTotal1 = classTotal[1]
  if(classTotal1 === 0){
    classTotal1 = ""
  }else if(classTotal1 < 1){
    classTotal1 = "α"
  }else{
    classTotal1 = classTotal1
  }
  let classTotal2 = classTotal[2]
  if(classTotal2 === 0){
    classTotal2 = ""
  }else{
    classTotal2
  }
  let classTotal3 = classTotal[3]
  if(classTotal3 === 0){
    classTotal3 = ""
  }else if(classTotal3 < 1){
    classTotal3 = "α"
  }else{
    classTotal3 = classTotal3
  }
  let classTotal4 = classTotal[4]
  if(classTotal4 === 0){
    classTotal4 = ""
  }else if(classTotal4 < 1){
    classTotal4 = "α"
  }else{
    classTotal4 = classTotal4
  }
  let classTotal5 = classTotal[5]
  if(classTotal5 === 0){
    classTotal5 = ""
  }else{
    classTotal5
  }

  csvContent = csvContent.replace("{{TOTAL_KWH_DEN_HOKKIDO}}", totalUseDen0)
  csvContent = csvContent.replace("{{TOTAL_PRI_DEN_HOKKIDO}}", sumTotalPriceDen0)
  csvContent = csvContent.replace("{{TOTAL_COUN_DEN_HOKKIDO}}", invoiceDenCount0)
  csvContent = csvContent.replace("{{TOTAL_KWH_DOU_HOKKIDO}}", totalUseDou0)
  csvContent = csvContent.replace("{{TOTAL_PRI_DOU_HOKKIDO}}", sumTotalPriceDou0)
  csvContent = csvContent.replace("{{TOTAL_COUN_DOU_HOKKIDO}}", invoiceDouCount0)

  csvContent = csvContent.replace("{{TOTAL_KWH_DEN_TOHOK}}", totalUseDen1)
  csvContent = csvContent.replace("{{TOTAL_PRI_DEN_TOHOK}}", sumTotalPriceDen1)
  csvContent = csvContent.replace("{{TOTAL_COUN_DEN_TOHOK}}", invoiceDenCount1)
  csvContent = csvContent.replace("{{TOTAL_KWH_DOU_TOHOK}}", totalUseDou1)
  csvContent = csvContent.replace("{{TOTAL_PRI_DOU_TOHOK}}", sumTotalPriceDou1)
  csvContent = csvContent.replace("{{TOTAL_COUN_DOU_TOHOK}}", invoiceDouCount1)

  csvContent = csvContent.replace("{{TOTAL_KWH_DEN_TOKYO}}", totalUseDen2)
  csvContent = csvContent.replace("{{TOTAL_PRI_DEN_TOKYO}}", sumTotalPriceDen2)
  csvContent = csvContent.replace("{{TOTAL_COUN_DEN_TOKYO}}", invoiceDenCount2)
  csvContent = csvContent.replace("{{TOTAL_KWH_DOU_TOKYO}}", totalUseDou2)
  csvContent = csvContent.replace("{{TOTAL_PRI_DOU_TOKYO}}", sumTotalPriceDou2)
  csvContent = csvContent.replace("{{TOTAL_COUN_DOU_TOKYO}}", invoiceDouCount2)

  csvContent = csvContent.replace("{{TOTAL_KWH_DEN_CYUBU}}", totalUseDen3)
  csvContent = csvContent.replace("{{TOTAL_PRI_DEN_CYUBU}}", sumTotalPriceDen3)
  csvContent = csvContent.replace("{{TOTAL_COUN_DEN_CYUBU}}", invoiceDenCount3)
  csvContent = csvContent.replace("{{TOTAL_KWH_DOU_CYUBU}}", totalUseDou3)
  csvContent = csvContent.replace("{{TOTAL_PRI_DOU_CYUBU}}", sumTotalPriceDou3)
  csvContent = csvContent.replace("{{TOTAL_COUN_DOU_CYUBU}}", invoiceDouCount3)

  csvContent = csvContent.replace("{{TOTAL_KWH_DEN_HOKRIK}}", totalUseDen4)
  csvContent = csvContent.replace("{{TOTAL_PRI_DEN_HOKRIK}}", sumTotalPriceDen4)
  csvContent = csvContent.replace("{{TOTAL_COUN_DEN_HOKRIK}}", invoiceDenCount4)
  csvContent = csvContent.replace("{{TOTAL_KWH_DOU_HOKRIK}}", totalUseDou4)
  csvContent = csvContent.replace("{{TOTAL_PRI_DOU_HOKRIK}}", sumTotalPriceDou4)
  csvContent = csvContent.replace("{{TOTAL_COUN_DOU_HOKRIK}}", invoiceDouCount4)

  csvContent = csvContent.replace("{{TOTAL_KWH_DEN_KANSAI}}", totalUseDen5)
  csvContent = csvContent.replace("{{TOTAL_PRI_DEN_KANSAI}}", sumTotalPriceDen5)
  csvContent = csvContent.replace("{{TOTAL_COUN_DEN_KANSAI}}", invoiceDenCount5)
  csvContent = csvContent.replace("{{TOTAL_KWH_DOU_KANSAI}}", totalUseDou5)
  csvContent = csvContent.replace("{{TOTAL_PRI_DOU_KANSAI}}", sumTotalPriceDou5)
  csvContent = csvContent.replace("{{TOTAL_COUN_DOU_KANSAI}}", invoiceDouCount5)

  csvContent = csvContent.replace("{{TOTAL_KWH_DEN_CYUGOKU}}", totalUseDen6)
  csvContent = csvContent.replace("{{TOTAL_PRI_DEN_CYUGOKU}}", sumTotalPriceDen6)
  csvContent = csvContent.replace("{{TOTAL_COUN_DEN_CYUGOKU}}", invoiceDenCount6)
  csvContent = csvContent.replace("{{TOTAL_KWH_DOU_CYUGOKU}}", totalUseDou6)
  csvContent = csvContent.replace("{{TOTAL_PRI_DOU_CYUGOKU}}", sumTotalPriceDou6)
  csvContent = csvContent.replace("{{TOTAL_COUN_DOU_CYUGOKU}}", invoiceDouCount6)

  csvContent = csvContent.replace("{{TOTAL_KWH_DEN_SIKOKU}}", totalUseDen7)
  csvContent = csvContent.replace("{{TOTAL_PRI_DEN_SIKOKU}}", sumTotalPriceDen7)
  csvContent = csvContent.replace("{{TOTAL_COUN_DEN_SIKOKU}}", invoiceDenCount7)
  csvContent = csvContent.replace("{{TOTAL_KWH_DOU_SIKOKU}}", totalUseDou7)
  csvContent = csvContent.replace("{{TOTAL_PRI_DOU_SIKOKU}}", sumTotalPriceDou7)
  csvContent = csvContent.replace("{{TOTAL_COUN_DOU_SIKOKU}}", invoiceDouCount7)

  csvContent = csvContent.replace("{{TOTAL_KWH_DEN_KYUSYU}}", totalUseDen8)
  csvContent = csvContent.replace("{{TOTAL_PRI_DEN_KYUSYU}}", sumTotalPriceDen8)
  csvContent = csvContent.replace("{{TOTAL_COUN_DEN_KYUSYU}}", invoiceDenCount8)
  csvContent = csvContent.replace("{{TOTAL_KWH_DOU_KYUSYU}}", totalUseDou8)
  csvContent = csvContent.replace("{{TOTAL_PRI_DOU_KYUSYU}}", sumTotalPriceDou8)
  csvContent = csvContent.replace("{{TOTAL_COUN_DOU_KYUSYU}}", invoiceDouCount8)

  csvContent = csvContent.replace("{{TOTAL_KWH_DEN_TOTAL}}", classTotal0)
  csvContent = csvContent.replace("{{TOTAL_PRI_DEN_TOTAL}}", classTotal1)
  csvContent = csvContent.replace("{{TOTAL_COUN_DEN_TOTAL}}", classTotal2)
  csvContent = csvContent.replace("{{TOTAL_KWH_DOU_TOTAL}}", classTotal3)
  csvContent = csvContent.replace("{{TOTAL_PRI_DOU_TOTAL}}", classTotal4)
  csvContent = csvContent.replace("{{TOTAL_COUN_DOU_TOTAL}}", classTotal5)

  const outputFileName = `${dayjs(reportMonth).format("YYYYMM")}_様式第11表1表_${ppsName}株式会社.csv`
  console.log(csvContent)  //とりあえずconsole.logで結果を出す。
  downloadFile(outputFileName, csvContent)
  console.log('done')
}

//function getTargetCsvFiles(){
//const inputDir = "input"
//const targetFiles = fs.readdirSync(inputDir)
//.map(filename =>{
//      return inputDir + "/" + filename
//    })  
//  return targetFiles
//}

function setRenewableCostPrice(useData){
  const meisho = "明細名称"
  const price = "明細金額"
  const renewableCostName = "再エネ賦課金"
  const MEISAI_LIMIT = 26
  useData.forEach(lineData=>{
    for(let cursor=1; cursor <= MEISAI_LIMIT; cursor++){
      const currentMeishoName = `${meisho}${cursor}`
      const currentMeisho = lineData[currentMeishoName]
      if(currentMeisho === renewableCostName){
        lineData.再エネ賦課金_金額 = lineData[`${price}${cursor}`]
        return
      }
    }
  })
}

function getCsvTemplate(){
  return `様式第１１（第２条関係）　                                                                                                                                                          　　　,,,,,,,,,,　{{CRETED_DATE}},,,
第１表　販売電力量・契約口数,,,,,,,,,,,,,
,,,,,,,,,,,,,
電力・ガス取引監視等委員会　委員長　殿,,,,,,,,,,,,,
,,,,,,,       　　{{REPORT_MONTH}},,,,小売電気事業者名,{{PPS_NAME}}株式会社,
,,,,,,,,,,,,,
１　販売電力量・販売額・契約口数,,,,,,,,,,,,,
"供給
区域",特別高圧,,,高圧,,,低圧,,,,,,その他需要
,,,,,,,電灯,,,電力,,,
,"販売電力量
（１０３kWh）","販売額
（千円）",契約口数,"販売電力量
（１０３kWh）","販売額
（千円）",契約口数,"販売電力量
（１０３kWh）","販売額
（千円）",契約口数,"販売電力量
（１０３kWh）","販売額
（千円）",契約口数,"販売電力量
（１０３kWh）"
北海道,,,,,,,{{TOTAL_KWH_DEN_HOKKIDO}},{{TOTAL_PRI_DEN_HOKKIDO}},{{TOTAL_COUN_DEN_HOKKIDO}},{{TOTAL_KWH_DOU_HOKKIDO}},{{TOTAL_PRI_DOU_HOKKIDO}},{{TOTAL_COUN_DOU_HOKKIDO}},
東北,,,,,,,{{TOTAL_KWH_DEN_TOHOK}},{{TOTAL_PRI_DEN_TOHOK}},{{TOTAL_COUN_DEN_TOHOK}},{{TOTAL_KWH_DOU_TOHOK}},{{TOTAL_PRI_DOU_TOHOK}},{{TOTAL_COUN_DOU_TOHOK}},
東京,,,,,,,{{TOTAL_KWH_DEN_TOKYO}},{{TOTAL_PRI_DEN_TOKYO}},{{TOTAL_COUN_DEN_TOKYO}},{{TOTAL_KWH_DOU_TOKYO}},{{TOTAL_PRI_DOU_TOKYO}},{{TOTAL_COUN_DOU_TOKYO}},
中部,,,,,,,{{TOTAL_KWH_DEN_CYUBU}},{{TOTAL_PRI_DEN_CYUBU}},{{TOTAL_COUN_DEN_CYUBU}},{{TOTAL_KWH_DOU_CYUBU}},{{TOTAL_PRI_DOU_CYUBU}},{{TOTAL_COUN_DOU_CYUBU}},
北陸,,,,,,,{{TOTAL_KWH_DEN_HOKRIK}},{{TOTAL_PRI_DEN_HOKRIK}},{{TOTAL_COUN_DEN_HOKRIK}},{{TOTAL_KWH_DOU_HOKRIK}},{{TOTAL_PRI_DOU_HOKRIK}},{{TOTAL_COUN_DOU_HOKRIK}},
関西,,,,,,,{{TOTAL_KWH_DEN_KANSAI}},{{TOTAL_PRI_DEN_KANSAI}},{{TOTAL_COUN_DEN_KANSAI}},{{TOTAL_KWH_DOU_KANSAI}},{{TOTAL_PRI_DOU_KANSAI}},{{TOTAL_COUN_DOU_KANSAI}},
中国,,,,,,,{{TOTAL_KWH_DEN_CYUGOKU}},{{TOTAL_PRI_DEN_CYUGOKU}},{{TOTAL_COUN_DEN_CYUGOKU}},{{TOTAL_KWH_DOU_CYUGOKU}},{{TOTAL_PRI_DOU_CYUGOKU}},{{TOTAL_COUN_DOU_CYUGOKU}},
四国,,,,,,,{{TOTAL_KWH_DEN_SIKOKU}},{{TOTAL_PRI_DEN_SIKOKU}},{{TOTAL_COUN_DEN_SIKOKU}},{{TOTAL_KWH_DOU_SIKOKU}},{{TOTAL_PRI_DOU_SIKOKU}},{{TOTAL_COUN_DOU_SIKOKU}},
九州,,,,,,,{{TOTAL_KWH_DEN_KYUSYU}},{{TOTAL_PRI_DEN_KYUSYU}},{{TOTAL_COUN_DEN_KYUSYU}},{{TOTAL_KWH_DOU_KYUSYU}},{{TOTAL_PRI_DOU_KYUSYU}},{{TOTAL_COUN_DOU_KYUSYU}},
沖縄,,,,,,,,,,,,,
合計,,,,,,,{{TOTAL_KWH_DEN_TOTAL}},{{TOTAL_PRI_DEN_TOTAL}},{{TOTAL_COUN_DEN_TOTAL}},{{TOTAL_KWH_DOU_TOTAL}},{{TOTAL_PRI_DOU_TOTAL}},{{TOTAL_COUN_DOU_TOTAL}},
,,,,,,,,,,,,,
２　特定小売供給約款による供給の販売額,,,,,,,,,,,,,
"旧供給
区域",特定小売供給約款による供給の販売額（千円）,,,,,,,,,,,,
,高圧,,低圧,,,,,,,,,,
,,,電灯,電力,,,,,,,,,
,,,,,,,,,,,,,
,,,,,,,,,,,,,
"備考　１　みなし小売電気事業者以外の小売電気事業者は、２については記載する必要はない。
　　　　２　みなし小売電気事業者は、２に加えて１についても記載すること。また、１においては特定小売供給を含めた数値を記載すること。
　　　　３　１においては、一般送配電事業者の供給区域ごとに記載すること。
　　　　４　その他需要の欄には、建設工事用電力及び事業用電力に当たる内容を記載すること。
　　　　５　２の旧供給区域の欄には、みなし小売電気事業者として特定小売供給を行つている旧供給区域を記載すること。
　　　　６　沖縄電力株式会社以外は特定小売供給約款による供給の高圧の欄には記載する必要はない。
        ７  検針日が月末ではないこと、需要家によつて検針日が異なること等の理由により、一月分の販売電力量等の管理を暦月とは異なる期間を用いて行つている場合には、販売電力量等の管理に用いている期間を用いて
            月ごとの合計値を算出して記載すること。
　　　　８　販売額は、燃料費調整に係る額を含み、消費税、地方消費税及び再生可能エネルギー電気の調達に関する特別措置法（平成２３年法律第１０８号）第１６条第２項に基づいて算出される賦課金を除いた額とすること。
　　　　９　用紙の大きさは、日本工業規格A４とすること。",,,,,,,,,,,,,`
}

function downloadFile(fileName, fileContent){
  const a = document.createElement('a')
  const blob = new Blob(['\ufeff', fileContent], {type:'application/csv'})
  const downloadUrl = URL.createObjectURL(blob)
  a.download = fileName
  a.href = downloadUrl
  a.click()
  setTimeout(()=>{
    URL.revokeObjectURL(downloadUrl)
  }, 500)

}