// Certifique-se de que está exportando corretamente
export function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

export function isAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.status(403).send("Acesso negado. Apenas administradores podem realizar esta ação.");
}