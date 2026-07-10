/**
 * Sanitization Tests
 * Example test cases for input sanitization functions
 *
 * To run tests:
 * npm test -- src/lib/__tests__/sanitize.test.ts
 */

import {
  sanitizeXSS,
  sanitizeInput,
  sanitizeSearchQuery,
  sanitizeNumeric,
  sanitizeIdentifier,
  sanitizeEmail,
  sanitizeSQLInjection,
} from "../sanitize";

describe("XSS Sanitization", () => {
  describe("sanitizeXSS", () => {
    it("should escape HTML special characters", () => {
      const input = "<script>alert('xss')</script>";
      const result = sanitizeXSS(input);
      expect(result).not.toContain("<script>");
      expect(result).toContain("&lt;");
    });

    it("should escape img tag with onerror", () => {
      const input = '<img src=x onerror="alert(\'xss\')">';
      const result = sanitizeXSS(input);
      expect(result).not.toContain("onerror");
      expect(result).toContain("&lt;");
    });

    it("should escape quotes", () => {
      const input = 'Test with "double" and \'single\' quotes';
      const result = sanitizeXSS(input);
      expect(result).toContain("&quot;");
      expect(result).toContain("&#x27;");
    });

    it("should escape ampersands", () => {
      const input = "A & B & C";
      const result = sanitizeXSS(input);
      expect(result).toContain("&amp;");
    });

    it("should preserve safe text", () => {
      const input = "Hello World 123!";
      const result = sanitizeXSS(input);
      expect(result).toBe("Hello World 123!");
    });

    it("should handle empty strings", () => {
      expect(sanitizeXSS("")).toBe("");
      expect(sanitizeXSS(null as any)).toBe("");
    });
  });

  describe("sanitizeInput", () => {
    it("should sanitize XSS and trim whitespace", () => {
      const input = "  <script>alert('xss')</script>  ";
      const result = sanitizeInput(input);
      expect(result).not.toContain("<script>");
      expect(result).not.toMatch(/^\s/);
      expect(result).not.toMatch(/\s$/);
    });

    it("should remove null bytes", () => {
      const input = "Hello\0World";
      const result = sanitizeInput(input);
      expect(result).not.toContain("\0");
      expect(result).toBe("HelloWorld");
    });

    it("should preserve safe input with special characters", () => {
      const input = "Price: $99.99 (50% off)";
      const result = sanitizeInput(input);
      expect(result).toContain("$");
      expect(result).toContain("%");
    });
  });
});

describe("SQL Injection Sanitization", () => {
  describe("sanitizeSQLInjection", () => {
    it("should remove SQL keywords", () => {
      const input = "'; DROP TABLE items; --";
      const result = sanitizeSQLInjection(input);
      expect(result).not.toContain("DROP");
      expect(result).not.toContain("TABLE");
    });

    it("should remove SQL comment syntax", () => {
      const input = "test -- comment";
      const result = sanitizeSQLInjection(input);
      expect(result).not.toContain("--");
    });

    it("should handle UNION SELECT attacks", () => {
      const input = "' UNION SELECT * FROM users --";
      const result = sanitizeSQLInjection(input);
      expect(result).not.toContain("UNION");
      expect(result).not.toContain("SELECT");
    });

    it("should be case insensitive", () => {
      const inputs = [
        "DROP TABLE",
        "drop table",
        "DrOp TaBlE",
      ];
      inputs.forEach((input) => {
        const result = sanitizeSQLInjection(input);
        expect(result).not.toContain("DROP");
        expect(result).not.toContain("TABLE");
      });
    });
  });
});

describe("Search Query Sanitization", () => {
  describe("sanitizeSearchQuery", () => {
    it("should remove HTML tags", () => {
      const input = "<script>alert('xss')</script>";
      const result = sanitizeSearchQuery(input);
      expect(result).not.toContain("<script>");
    });

    it("should allow search-friendly characters", () => {
      const input = 'search "quoted phrase"';
      const result = sanitizeSearchQuery(input);
      expect(result).toContain("search");
      expect(result).toContain("quoted");
    });

    it("should trim whitespace", () => {
      const input = "  search query  ";
      const result = sanitizeSearchQuery(input);
      expect(result).toBe("search query");
    });

    it("should remove null bytes", () => {
      const input = "search\0term";
      const result = sanitizeSearchQuery(input);
      expect(result).toBe("searchterm");
    });
  });
});

describe("Numeric Sanitization", () => {
  describe("sanitizeNumeric", () => {
    it("should extract only numeric characters", () => {
      const input = "Price: $99.99";
      const result = sanitizeNumeric(input);
      expect(result).toBe("99.99");
    });

    it("should handle negative numbers", () => {
      const input = "-42.5";
      const result = sanitizeNumeric(input);
      expect(result).toBe("-42.5");
    });

    it("should remove non-numeric characters", () => {
      const input = "123abc456";
      const result = sanitizeNumeric(input);
      expect(result).toBe("123456");
    });

    it("should handle strings", () => {
      const input = "100";
      const result = sanitizeNumeric(input);
      expect(result).toBe("100");
    });

    it("should handle numbers", () => {
      const input = 100 as any;
      const result = sanitizeNumeric(input);
      expect(result).toBe("100");
    });
  });
});

describe("Identifier Sanitization", () => {
  describe("sanitizeIdentifier", () => {
    it("should allow alphanumeric characters", () => {
      const input = "SKU-001-ITEM";
      const result = sanitizeIdentifier(input);
      expect(result).toBe("SKU-001-ITEM");
    });

    it("should allow underscores and hyphens", () => {
      const input = "user_id-123_test";
      const result = sanitizeIdentifier(input);
      expect(result).toBe("user_id-123_test");
    });

    it("should remove special characters", () => {
      const input = "SKU@#$%123";
      const result = sanitizeIdentifier(input);
      expect(result).toBe("SKU123");
    });

    it("should remove spaces", () => {
      const input = "SKU 001 ITEM";
      const result = sanitizeIdentifier(input);
      expect(result).toBe("SKU001ITEM");
    });
  });
});

describe("Email Sanitization", () => {
  describe("sanitizeEmail", () => {
    it("should lowercase email", () => {
      const input = "User@EXAMPLE.COM";
      const result = sanitizeEmail(input);
      expect(result).toBe("user@example.com");
    });

    it("should trim whitespace", () => {
      const input = "  user@example.com  ";
      const result = sanitizeEmail(input);
      expect(result).toBe("user@example.com");
    });

    it("should remove HTML characters", () => {
      const input = "<user@example.com>";
      const result = sanitizeEmail(input);
      expect(result).toBe("user@example.com");
    });

    it("should handle valid emails", () => {
      const input = "john.doe+tag@example.co.uk";
      const result = sanitizeEmail(input);
      expect(result).toBe("john.doe+tag@example.co.uk");
    });
  });
});

describe("Integration Tests", () => {
  it("should handle complex XSS attack", () => {
    const complexXSS = `';"><script>alert(String.fromCharCode(88,83,83))</script>`;
    const result = sanitizeInput(complexXSS);
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("alert");
  });

  it("should handle SQL injection with XSS", () => {
    const combined = `'; DROP TABLE users; --<script>alert('xss')</script>`;
    const xssResult = sanitizeXSS(combined);
    const sqlResult = sanitizeSQLInjection(combined);

    expect(xssResult).not.toContain("<script>");
    expect(sqlResult).not.toContain("DROP TABLE");
  });

  it("should preserve legitimate data after sanitization", () => {
    const legitimate = "Item SKU-001 costs $99.99 (50% off)";
    const result = sanitizeInput(legitimate);
    expect(result).toContain("SKU-001");
    expect(result).toContain("$99.99");
    expect(result).toContain("50%");
  });
});
