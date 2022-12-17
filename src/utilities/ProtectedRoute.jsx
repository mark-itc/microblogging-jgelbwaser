import { Navigate, useSearchParams } from "react-router-dom";

function ProtectedRoute({ Component, path, isLoggedIn, ...props }) {

    const [searchParams] = useSearchParams();
    const fromParamURI  = searchParams.get('from');
    const requestedPage = fromParamURI ?  decodeURIComponent(fromParamURI) : null
    const pageToRedirect = (requestedPage !== '/login')? requestedPage : null
    console.log('pageToRedirect', pageToRedirect, 'requestedPage', requestedPage)
    console.log('Component.name', Component.name)

    if (path === '/login'|| path === '/signup') {
        return isLoggedIn ? (
            pageToRedirect ? <Navigate to={pageToRedirect} /> : <Navigate to='/' />         
        ) : (
            <Component />
        )
    }

    return isLoggedIn ? (
        pageToRedirect ? <Navigate to={pageToRedirect} /> : <Component />
    ) : (
        <Navigate to={{
            pathname: `/login`,
            search: "?from=" + encodeURIComponent(path)
        }} />
    )
};

export default ProtectedRoute;