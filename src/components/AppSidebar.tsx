import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Sparkles,
  MessageSquare,
  Users,
  UserPlus,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";   

const menuItems = [
  { title: "Campanhas",        url: "/dashboard",     icon: MessageSquare },
  { title: "Clientes",         url: "/clients",       icon: Users },
  { title: "Importar Clientes",url: "/import-clients",icon: UserPlus },
  { title: "Configurações",    url: "/settings",      icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout } = useAuth();               
  const location   = useLocation();
  const navigate   = useNavigate();
  const collapsed  = state === "collapsed";

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/10 text-primary border-r-2 border-primary"
      : "hover:bg-muted/50";

  const handleLogout = () => {
    logout();                                       
    navigate("/login");
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon" style={{ backgroundColor: "#0D1321" }}>
      <SidebarContent>
        {/* --- Cabeçalho --- */}
        <div className="p-4 border-b border-border" >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-primary shrink-0">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h2 className="font-bold text-lg truncate">CampanhasPro</h2>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- Menu --- */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(({ title, url, icon: Icon }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={url}
                      end
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* --- Rodapé --- */}
        <div className="mt-auto border-t border-border">
          {!collapsed && (
            <div className="p-4">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}

          <Button
            onClick={handleLogout}
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}