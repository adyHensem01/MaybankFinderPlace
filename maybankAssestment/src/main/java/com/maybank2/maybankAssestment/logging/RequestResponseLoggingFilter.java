package com.maybank2.maybankAssestment.logging;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Logs every API REQUEST and RESPONSE (method, URI, body, status, duration) to logs/app.log.
 * Each pair shares a requestId so they are easy to match in the log file.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestResponseLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger("API_LOG");
    private static final int MAX_BODY_LENGTH = 10_000;
    private static final String REQUEST_ID_HEADER = "X-Request-Id";

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        ContentCachingRequestWrapper req = new ContentCachingRequestWrapper(request, MAX_BODY_LENGTH);
        ContentCachingResponseWrapper res = new ContentCachingResponseWrapper(response);

        String requestId = UUID.randomUUID().toString().substring(0, 8);
        MDC.put("requestId", requestId);
        res.setHeader(REQUEST_ID_HEADER, requestId);
        long start = System.currentTimeMillis();

        try {
            chain.doFilter(req, res);
        } finally {
            long duration = System.currentTimeMillis() - start;
            String query = req.getQueryString() != null ? "?" + req.getQueryString() : "";

            // request body is only available after the controller has read it, so log both here
            log.info("REQUEST  {} {}{} body={}", req.getMethod(), req.getRequestURI(), query,
                    toText(req.getContentAsByteArray()));
            log.info("RESPONSE {} {}{} status={} ({} ms) body={}", req.getMethod(), req.getRequestURI(), query,
                    res.getStatus(), duration, toText(res.getContentAsByteArray()));

            res.copyBodyToResponse(); // send the cached body to the client
            MDC.remove("requestId");
        }
    }

    private static String toText(byte[] content) {
        if (content.length == 0) {
            return "-";
        }
        String text = new String(content, StandardCharsets.UTF_8).replaceAll("\\s*\\R\\s*", " ");
        return text.length() > MAX_BODY_LENGTH ? text.substring(0, MAX_BODY_LENGTH) + "...(truncated)" : text;
    }
}
