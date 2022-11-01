``request-signal`` S->C
参数 ``val: SignalPara`` 表示向客户端发送请求的类型和参数。

``resolve-signal`` C->S
参数 ``para: CardPara`` 表示响应服务端的操作的类型参数。

``get-available-pos`` C->S
参数 ``card: string`` 表示查询如果当前打出某张牌，可抵达的合法位置集合。
