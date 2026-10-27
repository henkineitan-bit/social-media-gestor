import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './app/shared/components/navbar.component';
import { AuthService } from './app/core/services/auth.service';
import { AuthUser } from './app/core/models/auth.model';

const DashboardComponent = lazy(() =>
  import('./app/features/admin/dashboard/dashboard.component').then((m) => ({ default: m.DashboardComponent }))
);
const QuoteBuilderComponent = lazy(() =>
  import('./app/features/admin/quote-builder/quote-builder.component').then((m) => ({ default: m.QuoteBuilderComponent }))
);
const ProposalViewComponent = lazy(() =>
  import('./app/features/public/proposal-view/proposal-view.component').then((m) => ({ default: m.ProposalViewComponent }))
);
const ClientListComponent = lazy(() =>
  import('./app/features/admin/client-manager/client-list.component').then((m) => ({ default: m.ClientListComponent }))
);
const ClientDetailComponent = lazy(() =>
  import('./app/features/admin/client-manager/client-detail.component').then((m) => ({ default: m.ClientDetailComponent }))
);
const ClientPortalComponent = lazy(() =>
  import('./app/features/public/client-portal/client-portal.component').then((m) => ({ default: m.ClientPortalComponent }))
);
const ServicesStoreComponent = lazy(() =>
  import('./app/features/public/store/services-store.component').then((m) => ({ default: m.ServicesStoreComponent }))
);
const CatalogManagerComponent = lazy(() =>
  import('./app/features/admin/catalog-manager/catalog-manager.component').then((m) => ({ default: m.CatalogManagerComponent }))
);

type AppRoute = 'dashboard' | 'builder' | 'proposal' | 'crm-list' | 'crm-detail' | 'portal' | 'store' | 'catalog';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => AuthService.getCurrentUser());
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('store');
  const [routeParam, setRouteParam] = useState<string | null>(null);

  // Subscribe to auth changes
  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser());
    const unsub = AuthService.subscribe((u) => {
      setCurrentUser(u);
    });
    return unsub;
  }, []);

  // Parse initial route from browser URL or query params
  useEffect(() => {
    const parseLocation = () => {
      const pathname = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);

      const viewParam = searchParams.get('view');
      const slugParam = searchParams.get('slug');
      const idParam = searchParams.get('id');
      const auth = AuthService.getCurrentUser();

      if (viewParam === 'store' || viewParam === 'tienda' || viewParam === 'servicios' || pathname === '/tienda' || pathname === '/servicios') {
        setCurrentRoute('store');
        return;
      }

      if (viewParam === 'propuesta' || viewParam === 'proposal') {
        setCurrentRoute('proposal');
        setRouteParam(slugParam || 'familia-cardoso');
        return;
      }

      if (viewParam === 'portal') {
        setCurrentRoute('portal');
        setRouteParam(idParam || (auth?.role === 'client' ? auth.clientId : 'client-familia-cardoso') || 'client-familia-cardoso');
        return;
      }

      if (viewParam === 'builder') {
        setCurrentRoute('builder');
        setRouteParam(idParam || null);
        return;
      }

      if (viewParam === 'crm-list' || viewParam === 'clientes') {
        setCurrentRoute('crm-list');
        return;
      }

      if (viewParam === 'banners' || viewParam === 'promotions' || viewParam === 'promociones') {
        setCurrentRoute('catalog');
        setRouteParam('promotions');
        return;
      }

      if (viewParam === 'catalog' || viewParam === 'catalogo' || pathname === '/catalogo' || pathname === '/catalog') {
        setCurrentRoute('catalog');
        setRouteParam(searchParams.get('tab') || null);
        return;
      }

      if (viewParam === 'crm-detail' || viewParam === 'cliente-detalle') {
        setCurrentRoute('crm-detail');
        setRouteParam(idParam || 'client-familia-cardoso');
        return;
      }

      // Path-based routing
      const proposalMatch = pathname.match(/\/propuesta\/(.+)/);
      if (proposalMatch) {
        setCurrentRoute('proposal');
        setRouteParam(proposalMatch[1]);
        return;
      }

      const portalMatch = pathname.match(/\/portal\/(.+)/);
      if (portalMatch) {
        setCurrentRoute('portal');
        setRouteParam(portalMatch[1]);
        return;
      }

      if (pathname.startsWith('/builder')) {
        const idMatch = pathname.match(/\/builder\/(.+)/);
        setCurrentRoute('builder');
        setRouteParam(idMatch ? idMatch[1] : null);
        return;
      }

      if (pathname.startsWith('/admin/clientes') || pathname.startsWith('/clientes')) {
        const clientMatch = pathname.match(/\/(?:admin\/)?clientes\/(.+)/);
        if (clientMatch) {
          setCurrentRoute('crm-detail');
          setRouteParam(clientMatch[1]);
        } else {
          setCurrentRoute('crm-list');
        }
        return;
      }

      // Root default: If logged in as admin -> dashboard; if client -> portal; if guest -> store
      if (auth?.role === 'admin' || auth?.role === 'team') {
        setCurrentRoute('dashboard');
        setRouteParam(null);
      } else if (auth?.role === 'client') {
        setCurrentRoute('portal');
        setRouteParam(auth.clientId || 'client-familia-cardoso');
      } else {
        setCurrentRoute('store');
        setRouteParam(null);
      }
    };

    parseLocation();
    window.addEventListener('popstate', parseLocation);
    return () => window.removeEventListener('popstate', parseLocation);
  }, []);

  // Enforce role-based access: Clients cannot access admin routes
  useEffect(() => {
    if (currentUser?.role === 'client') {
      const adminRoutes: AppRoute[] = ['dashboard', 'builder', 'crm-list', 'crm-detail', 'catalog'];
      if (adminRoutes.includes(currentRoute)) {
        setCurrentRoute('portal');
        setRouteParam(currentUser.clientId || 'client-familia-cardoso');
      }
    }
  }, [currentRoute, currentUser]);

  const navigateTo = (route: string, param?: string) => {
    const targetRoute = route as AppRoute;
    setCurrentRoute(targetRoute);
    setRouteParam(param || null);

    // Update browser history URL
    let newUrl = '/';
    if (targetRoute === 'store') {
      newUrl = '/?view=tienda';
    } else if (targetRoute === 'proposal' && param) {
      newUrl = `/?view=propuesta&slug=${encodeURIComponent(param)}`;
    } else if (targetRoute === 'portal' && param) {
      newUrl = `/?view=portal&id=${encodeURIComponent(param)}`;
    } else if (targetRoute === 'builder') {
      newUrl = param ? `/?view=builder&id=${encodeURIComponent(param)}` : '/?view=builder';
    } else if (targetRoute === 'crm-list') {
      newUrl = '/?view=crm-list';
    } else if (targetRoute === 'crm-detail' && param) {
      newUrl = `/?view=crm-detail&id=${encodeURIComponent(param)}`;
    } else if (targetRoute === 'catalog') {
      newUrl = param ? `/?view=catalogo&tab=${encodeURIComponent(param)}` : '/?view=catalogo';
    } else if (targetRoute === 'dashboard') {
      newUrl = '/?view=dashboard';
    }

    try {
      window.history.pushState({}, '', newUrl);
    } catch {
      // Ignore sandboxed iframe restriction
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hideNavbar = currentRoute === 'store' || currentRoute === 'proposal';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {!hideNavbar && (
        <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />
      )}

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentRoute}-${routeParam || ''}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex-1"
            >
              {currentRoute === 'store' && (
                <ServicesStoreComponent
                  onNavigateToProposal={(slug) => navigateTo('proposal', slug)}
                  onNavigateToPortal={(clientId) => navigateTo('portal', clientId)}
                  onNavigateToAdmin={() => navigateTo('dashboard')}
                  onNavigateToBanners={() => navigateTo('catalog', 'promotions')}
                />
              )}

              {currentRoute === 'dashboard' && (
                <DashboardComponent onNavigate={navigateTo} />
              )}

              {currentRoute === 'builder' && (
                <QuoteBuilderComponent
                  editQuoteId={routeParam}
                  onNavigate={navigateTo}
                />
              )}

              {currentRoute === 'proposal' && (
                <ProposalViewComponent
                  slug={routeParam || 'familia-cardoso'}
                  onNavigateBack={() => navigateTo(currentUser?.role === 'client' ? 'portal' : 'dashboard', currentUser?.clientId)}
                  onNavigateToClient={(clientId) => navigateTo('crm-detail', clientId)}
                />
              )}

              {currentRoute === 'crm-list' && (
                <ClientListComponent onNavigate={navigateTo} />
              )}

              {currentRoute === 'crm-detail' && (
                <ClientDetailComponent
                  clientId={routeParam || 'client-familia-cardoso'}
                  onNavigate={navigateTo}
                />
              )}

              {currentRoute === 'portal' && (
                <ClientPortalComponent
                  clientId={routeParam || currentUser?.clientId || 'client-familia-cardoso'}
                  onNavigateBack={() => navigateTo('dashboard')}
                  onNavigateToProposal={(slug) => navigateTo('proposal', slug)}
                />
              )}

              {currentRoute === 'catalog' && (
                <CatalogManagerComponent
                  onNavigate={navigateTo}
                  initialTab={routeParam === 'promotions' ? 'promotions' : undefined}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      {!hideNavbar && (
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-600 no-print">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              <span className="font-bold text-slate-800">Gestión Digital & Social Media</span> • Plataforma SaaS de Servicios & Entregables
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Motor de Cotizaciones, Catálogo de Precios, Entregas y Portal de Clientes
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
