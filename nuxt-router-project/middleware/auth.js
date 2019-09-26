/**
 * 如果该页面没有在登录状态
 * 转跳到 /admin/auth
 * @param context
 */
export default function(context) {
  if (!context.store.getters.isAuthenticated) {
    context.redirect("/admin/auth");
  }
}
