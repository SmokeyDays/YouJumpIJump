``request-signal`` S->C
表示请求客户端操作。
参数 ``val: SignalPara`` 表示向客户端发送请求的类型和参数。

``renew-game-state`` S->C
表示游戏状态更新。
参数 ``state: GameState`` 表示更新后后的游戏状态。

``resolve-signal`` C->S
表示客户端响应的操作。
参数 ``para: CardPara`` 表示响应服务端的操作的类型参数。

``get-available-pos`` C->S
用于查询合法集合。
参数 ``card: string`` 表示查询如果当前打出某张牌，可抵达的合法位置集合。

``renew-game-state`` S->C
更新游戏状态。
参数：

```
val: {
  state: GameState,
  localPlayer: number
}
```