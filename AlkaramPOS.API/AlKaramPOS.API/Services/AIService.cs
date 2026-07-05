using System.Text;
using System.Text.Json;
using POS.API.DTOs.AI;
using POS.API.Interfaces;
using POS.Interfaces.Repositories;
using POS.API.Models;
using POS.API.Interfaces.Repositories;

namespace POS.API.Services;

public class AIService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly ISaleRepository _saleRepository;
    private readonly IAISummaryRepository _aiSummaryRepository;

    public AIService(
    IHttpClientFactory factory,
    ISaleRepository saleRepository,
    IAISummaryRepository aiSummaryRepository)
    {
        _httpClient = factory.CreateClient();
        _saleRepository = saleRepository;
        _aiSummaryRepository = aiSummaryRepository;
    }

    public async Task<AISummaryResponseDto> GenerateSummaryAsync()
    {
        var revenue = await _saleRepository.GetTotalRevenueAsync();

        var completedSales = await _saleRepository.GetCompletedSalesCountAsync();

        var reversedSales = await _saleRepository.GetReversedSalesCountAsync();

        var topProducts = await _saleRepository.GetTopSellingProductsAsync();

        var lowStock = await _saleRepository.GetLowStockProductsAsync();

        string prompt = $@"
                You are an AI business analyst for a Point of Sale system.

                IMPORTANT RULES:

                - Never invent facts.
                - Never assume customer behaviour.
                - Never guess reasons.
                - Only analyze the numbers provided.
                - If information is unavailable, say so.

                Current POS Data

                Total Revenue:
                Rs {revenue}

                Completed Sales:
                {completedSales}

                Reversed Sales:
                {reversedSales}

                Top Selling Products:
                {string.Join(", ", topProducts.Select(x => $"{x.ProductName} ({x.Quantity})"))}

                Low Stock Products:
                {string.Join(", ", lowStock)}

                Write exactly these sections:

                Executive Summary

                Business Insights

                Recommendations

                Keep the response under 150 words.

                Use simple English.
                ";

        var request = new
        {
            model = "llama3.2",
            messages = new[]
            {
                new
                {
                    role = "user",
                    content = prompt
                }
            },
            stream = false
        };

        var json = JsonSerializer.Serialize(request);

        var response = await _httpClient.PostAsync(
            "http://localhost:11434/api/chat",
            new StringContent(
                json,
                Encoding.UTF8,
                "application/json"));

        response.EnsureSuccessStatusCode();

        var result =
            await response.Content.ReadAsStringAsync();

        using var document =
            JsonDocument.Parse(result);

        var summary =
            document.RootElement
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

        var aiSummary = new AISummary
        {
            Summary = summary ?? "",
            Revenue = revenue,
            CompletedSales = completedSales,
            ReversedSales = reversedSales,
            CreatedAt = DateTime.Now
        };

        await _aiSummaryRepository.AddAsync(aiSummary);

        await _aiSummaryRepository.SaveChangesAsync();

        return new AISummaryResponseDto
        {
            Summary = summary ?? ""
        };

    }

    public async Task<List<AISummaryHistoryDto>> GetHistoryAsync()
    {
        var summaries =
            await _aiSummaryRepository.GetAllAsync();

        return summaries.Select(x =>
            new AISummaryHistoryDto
            {
                Id = x.Id,
                Revenue = x.Revenue,
                CompletedSales = x.CompletedSales,
                ReversedSales = x.ReversedSales,
                Summary = x.Summary,
                CreatedAt = x.CreatedAt
            }).ToList();
    }
}