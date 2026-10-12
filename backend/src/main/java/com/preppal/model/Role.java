package com.preppal.model;

/**
 * Roles available to PrepPal users.
 * New users always receive the STUDENT role via the registration flow.
 * Role is never accepted from client input.
 */
public enum Role {
    STUDENT,
    ADMIN
}
