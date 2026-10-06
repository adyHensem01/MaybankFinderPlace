package com.maybank2.maybankAssestment.config;

import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    private static final Logger log = LoggerFactory.getLogger("THIRD_PARTY");

    @Bean
    public RestClient weatherRestClient(@Value("${thirdparty.weather.base-url}") String baseUrl) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(5));
        requestFactory.setReadTimeout(Duration.ofSeconds(10));

        return RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .requestInterceptor(loggingInterceptor())
                .build();
    }

    /** Logs every outgoing 3rd-party call (URL, status, duration) to the same log file. */
    private ClientHttpRequestInterceptor loggingInterceptor() {
        return (request, body, execution) -> {
            long start = System.currentTimeMillis();
            log.info("OUTBOUND REQUEST  {} {}", request.getMethod(), request.getURI());
            ClientHttpResponse response = execution.execute(request, body);
            log.info("OUTBOUND RESPONSE {} {} -> {} ({} ms)", request.getMethod(), request.getURI(),
                    response.getStatusCode().value(), System.currentTimeMillis() - start);
            return response;
        };
    }
}
