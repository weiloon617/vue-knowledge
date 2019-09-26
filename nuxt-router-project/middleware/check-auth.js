/**
 * 检查该页面有没有在登录状态
 * @param context
 */
export default function(context) {
  context.store.dispatch("initAuth", context.req);
}
