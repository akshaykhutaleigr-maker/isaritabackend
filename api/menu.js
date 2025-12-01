const express = require('express');
const router = express.Router();
const { prisma, serializeBigInt } = require("../common");

router.post('/getMenu', async (req, res) => {
  try {
    
  const {role_id } = req.body;
    if (!role_id) return res.status(400).json({ error: 'roleId is required' });
    const permissions = await prisma.userPermissions.findMany({
      where: { role_id: role_id },
      select: {
        menu_id: true,
        submenu_id: true,
          subsubmenu_id: true
      }
    });

    const menuIds = [...new Set(permissions.map(x => Number(x.menu_id)).filter(Boolean))];
    const submenuIds = [...new Set(permissions.map(x => Number(x.submenu_id)).filter(Boolean))];
     const subsubmenuIds = [...new Set(permissions.map(x => Number(x.subsubmenu_id)).filter(Boolean))];

    const menus = await prisma.menu.findMany({
      where: { id: { in: menuIds } },
    select: {
    id: true,       
    name_en: true  
  }
    });

  const submenus = await prisma.subMenu.findMany({
  where: { id: { in: submenuIds } },
  select: {
    id: true,          
    main_menu_id: true, 
    name_en: true   
  }
    });
 const subsubmenus = await prisma.subSubMenu.findMany({
      where: { id: { in: subsubmenuIds } },
      select: {
        id: true,
        sub_menu_id: true,
        name_en: true
      }
    });
    const tree = menus.map(menu => {
      const childrenSubmenus = submenus
        .filter(sub => sub.main_menu_id === menu.id)
        .map(sub => {
          const childrenSubSubmenus = subsubmenus.filter(
            s => s.sub_menu_id === sub.id
          );
          return { ...sub, subsubmenus: childrenSubSubmenus };
        });
      return { ...menu, submenus: childrenSubmenus };
    });


   return res.json(serializeBigInt({ menus: tree }));
  } catch (err) {
    console.error('Error fetching menus:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
